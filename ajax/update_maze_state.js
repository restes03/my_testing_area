/** TODO:
 * 
 * 1. redraw div in same container each refresh cycle
 * 2. carve maze using json data
 * 3. provide cell access
 * 4. solve maze
 * 5. refactor getNeighbor. Cycle through an array rather than switch?
 * 5. implement proper error handling
 */



/** Global Variables **/

// Number of rows and columns contained in the maze
var rows;
var cols;

// Index of cell ID's
// Made two-dimensional in init()
var maze_index = [];

// Stores bitwise values for each cell indicating open doors
// Made two-dimensional in init()
var maze_map = [];

// Used by carve_maze and solve_maze to track visited cells
var visited_list = ["0x0"];

// Using an enum simplifies the process of randomizing/shuffling
// directions to traverse.

var DIRECTION = Object.freeze({
    "N": 0,
    "S": 1,
    "E": 2,
    "W": 3
});

// Time between refresh cycles
var interval_ms = 500;

// REST API to fetch maze state
var URL = 'http://maze-service-code-camp.a3c1.starter-us-west-1.openshiftapps.com/get/10:15:SimpleSample';






function init() {
    
    setInterval(update_loop, interval_ms);

};

function update_loop() {  
    console.log("Sending request...");
    var request = new XMLHttpRequest();

    
    // Primitve error checking
    if (!request) {
      alert('Unable to create instance of request');
      return false;
    }

    
    request.onreadystatechange = getResponse;
    request.open('GET', URL);
    request.responseType='json';
    request.send();
    
    function getResponse() {

        // readyState values:
        // 0 (uninitialized) or (request not initialized)
        // 1 (loading) or (server connection established)
        // 2 (loaded) or (request received)
        // 3 (interactive) or (processing request)
        // 4 (complete) or (request finished and response is ready)
    
        if (request.readyState === request.DONE) {
          if (request.status === 200) {

            var mazeJson = request.response;
            rows = Number(mazeJson.width);
            cols = Number(mazeJson.height);

            // Initialize maze arrays
            initMaze();
            
            // generate maze grid
            genMazeGrid(rows, cols);

            // carve maze
            //carve_maze("0x0");
            
            // var superHeroes = JSON.parse(superHeroesText);
          } else {
            alert("Unable to connect to server. \n\n Request status: " + request.status);
            }
        }
    }
};


function initMaze() {
      // initialize maze map
    for (var i = 0; i < rows; i++) {
        maze_index.push(new Array(cols));
        maze_map.push(new Array(cols));
        for (var j = 0; j < cols; j++) {
            maze_index[i][j] = 0;
            maze_map[i][j] = 0;
        }
    }
};

/** Function genMazeGrid(rows, cols)
 * Generates a grid of cells which form the fundamental
 * structure of a maze.
 * 
 * @param	rows	Number of rows to include in the grid.
 * @param	cols	Number of columns to include in the grid.
 * 
 * 
 */

function genMazeGrid(rows, cols) {
  // cells are 30px each having left and right borders
  // of 1px each. Total maze width is then:
  maze_width = cols * 32;
    var maze_container;

    if(document.getElementById("maze_container")==null){
        maze_container = document.createElement('div');
        maze_container.setAttribute("id", "maze_container");
        document.body.appendChild(maze_container);
        maze_container.style.width = maze_width + "px";
  }
 

  // generate grid having rows x cols
    for (var i = 0; i < rows; i++) {
        // Create first row...
        var row = document.createElement('div');
        row.setAttribute("class", "row");
        maze_container.appendChild(row);
        row.style.width = maze_width + "px";

      // Fill row with cells...
        for (var j = 0; j < cols; j++) {
            var temp = document.createElement('span');

            // We want to be able to identify individual cells,
            // so assign each an ID having form "row# col#"
            var id_string = i + "x" + j;
            temp.setAttribute("id", id_string);
            temp.setAttribute("class", "cell");
            row.appendChild(temp);

            // Map the maze
            maze_index[i][j] = id_string;
      }
  }
}; // end genMazeGrid()


/** Function carve_maze(current_cell_index)
 * Carves a path from starting cell at 0x0 to a 
 * random endpoint.
 * 
 * @param	current_cell_index	The index of the current cell
 * 					having form '1x4' where 1 is the row
 * 					number and 4 is the column number. 
 */
function carve_maze(current_cell_index) {

    /** Depth-first traversal
	*
	* Steps:
	*
	*	1)	Choose a starting point in the field.
	*	2)	Randomly choose a wall at that point and carve
	*		a passage through to the adjacent cell, but only
	* 		if the adjacent cell has not been visited yet.
	* 		This becomes the new current cell.
	* 	3)	If all adjacent cells have been visited, back up
	* 		to the last cell that has uncarved walls and repeat.
	* 	4)	The algorithm ends when the process has backed all
	* 		the way up to the starting point.
    *	
    * Source:
    * 	http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
    **/

	// randomize a list of four directions 
	// TODO: At most, only three directions are possible.
    var directions = shuffle([DIRECTION.N, DIRECTION.S, DIRECTION.E, DIRECTION.W]);
    
		for (var i = 0; i < directions.length; i++) {
	        var new_cell_index = getNeighbor(current_cell_index, directions[i]);
	        if (new_cell_index != "-1x-1") {
	            // remove borders between cells...
	            open(current_cell_index, new_cell_index, directions[i]);
	            carve_maze(new_cell_index);
	        }
	        else {	// neighboring cell is invalid. Try next.
				continue;
			}
	    }
}; // end carve_maze


/** Function getNeighbor(current_cell_index, direction)
 * Returns maze_index[][] index of current_cell_index's <direction> neighbor,
 * 
 * @param          current_cell_index	maze_index[][] index of current cell
 * @param          direction		Direction to look for neighbor.  
 * @return         new_cell_index	maze_index index of neighboring cell
 *									value is of form "row col" where 'row' and
 *									'col' are integers. Value is '-1x-1' if new
 * 									cell has already been visited, or cell does
 * 									not exist within the maze (out of bounds).
 * 									
 * 									
 */

function getNeighbor(current_cell_index, direction) {

    var new_cell_index;
    var temp = current_cell_index.split("x");
    var row = Number(temp[0]);
    var col = Number(temp[1]);
   
    switch (direction) {
        case DIRECTION.N: // North
            {
				if ((row-1) >= 0 && (row-1) < maze_index.length) {
					if (col >= 0 && col < maze_index[0].length) {
		                if (!visited_list.includes(maze_index[row-1][col])) {
		                    new_cell_index = maze_index[row-1][col];
		                    visited_list.push(new_cell_index);
		                    return new_cell_index;
						} 
						else {
							new_cell_index = "-1x-1";
						}
					} 
					else {
						new_cell_index = "-1x-1";
					}
                } 
                else { 
                    new_cell_index = "-1x-1";
                }
                return new_cell_index;
                break;
            }
        case DIRECTION.S: // South
            {
				if ((row+1) >= 0 && (row+1) < maze_index.length) {
					if (col >= 0 && col < maze_index[0].length) {
		                if (!(visited_list.includes(maze_index[row+1][col]))) {
		                    new_cell_index = maze_index[row+1][col];
							visited_list.push(new_cell_index);
		                    return new_cell_index;
						} 
						else {
							new_cell_index = "-1x-1";
						}visited_list
					} 
					else {
						new_cell_index = "-1x-1";
					}
                } 
                else { 
                    new_cell_index = "-1x-1";
                }
                return new_cell_index;
                break;
            }
        case DIRECTION.E: // East
            {
				if (row >= 0 && row < maze_index.length) {
					if ((col+1) >= 0 && (col+1) < maze_index[0].length) {
		                if (!visited_list.includes(maze_index[row][col+1])) {
		                    new_cell_index = maze_index[row][col+1];
		                    visited_list.push(new_cell_index);
		                    return new_cell_index;
						} 
						else {
							new_cell_index = "-1x-1";
						}
					} 
					else {
						new_cell_index = "-1x-1";
					}
                } 
                else { 
                    new_cell_index = "-1x-1";
                }
                return new_cell_index;
                break;
            }
        case DIRECTION.W: // West
            {
				if (row >= 0 && row < maze_index.length) {
					if ((col-1) >= 0 && (col-1) < maze_index[0].length) {
		                if (!visited_list.includes(maze_index[row][col-1])) {
		                    new_cell_index = maze_index[row][col-1];
		                    visited_list.push(new_cell_index);
		                    return new_cell_index;
						} 
						else {
							new_cell_index = "-1x-1";
						}
					} 
					else {
						new_cell_index = "-1x-1";
					}
                } 
                else { 
                    new_cell_index = "-1x-1";
                }
                return new_cell_index;                
                break;
            }
        default: // Invalid input
            {
                new_cell_index = "-1x-1";
            }
            return new_cell_index;
    }

};


/** Function open(current_cell_index, new_cell_index, direction)
 * This function performs two things: 
 * 	1) Opens walls standing between two cells. 
 * 	2) Cells are mapped using a bitwise value (maze_map[][]);
 * 
 *
 * @param	current_cell_index	index of starting cell
 * @param	new_cell_index		index of ending cell
 * @param	direction		direction from current cell to open
 *
 */

function open(current_cell_index, new_cell_index, direction) {
	

	
	var current_cell = document.getElementById(current_cell_index);
	var new_cell = document.getElementById(new_cell_index);
	
	var temp = current_cell_index.split("x");
    var cc_row = Number(temp[0]);
    var cc_col = Number(temp[1]);
	
	temp = new_cell_index.split("x");
	var nc_row = Number(temp[0]);
    var nc_col = Number(temp[1]);



	switch (direction) {
		case DIRECTION.N:
		{
			// open wall between cells
			current_cell.className += " openNorth";
			new_cell.className += " openSouth";
			
			// add cell doors to map
			maze_map[cc_row][cc_col] += 1;	// +1 for North
			maze_map[nc_row][nc_col] += 2;	// +2 for South
			break;
		}
		case DIRECTION.S:
		{
			current_cell.className += " openSouth";
			new_cell.className += " openNorth";
			
			maze_map[cc_row][cc_col] += 2;	// +2 for South
			maze_map[nc_row][nc_col] += 1;	// +1 for North
			break;
		}
		case DIRECTION.E:
		{
			current_cell.className += " openEast";
			new_cell.className += " openWest";
						
			maze_map[cc_row][cc_col] += 4;	// +4 for East
			maze_map[nc_row][nc_col] += 8;	// +8 for West
			break;
		}
		case DIRECTION.W:
		{
			current_cell.className += " openWest";
			new_cell.className += " openEast";
			
			maze_map[cc_row][cc_col] += 8;	// +8 for West
			maze_map[nc_row][nc_col] += 4;	// +4 for East
			break;
		}
	}

    
    
};	// end open()

/** Function solve_init()
 * This function resets the visited list, and passes the starting
 * cell to solve_maze. */
function solve_init() {
	visited_list = [];	//	reset visited_list to be used with solve_maze
	solve_maze("0x0");
};

/** Function solve_maze(current_call_index)
 * Finds a solution path through the maze from the starting cell 
 * at 0x0 (top-left) to the ending cell (bottom-right).
 * 
 * @param	current_cell_index	Used to access the current position as 
 * 								the maze is traversed. Acceptable values are
 * 								strings of the form '1x4' where 1 is the row
 * 								and 4 is the column.
 */
function solve_maze(current_cell_index) {
	
	if (current_cell_index == "-1x-1") {
		return;
	}
		
	// Add current cell to visited list
	visited_list.push(current_cell_index);

	var temp = current_cell_index.split("x");
    var row = Number(temp[0]);
    var col = Number(temp[1]);

		
		if (maze_map[row][col] & 1) {	//	north open
			if (!visited_list.includes(maze_index[rows-1][cols-1])) {
				solve_maze(getNeighbor(current_cell_index, DIRECTION.N));
			}
		}
		if (maze_map[row][col] & 2) {	//	south open
			if (!visited_list.includes(maze_index[rows-1][cols-1])) {
				solve_maze(getNeighbor(current_cell_index, DIRECTION.S));
			}
		}
		if (maze_map[row][col] & 4) {	//	east open
			if (!visited_list.includes(maze_index[rows-1][cols-1])) {
				solve_maze(getNeighbor(current_cell_index, DIRECTION.E));
			}
		}
		if (maze_map[row][col] & 8) {	//	west open
			if (!visited_list.includes(maze_index[rows-1][cols-1])) {
				solve_maze(getNeighbor(current_cell_index, DIRECTION.W));
			}
		}

	// once destination is reached, highlight the colors along the path moving backward
	if (visited_list.includes(maze_index[rows-1][cols-1])) {
		document.getElementById(current_cell_index).className += " solutionPath";
	}
};	// end solve_maze()



// *********************
/** Helper functions **/
// *********************



/** Function shuffle(directions)
 * Shuffles an array of 4 integers
 *
 * @param	directions		Contains 4 integers representing
 * 					four possible directions on a grid
 *					in no particular order: N, S, E, and W.
 * @return	directions_randomized	An array of shuffled integer values.
 * 
 */

function shuffle(directions) {

var directions_randomized = [];
var max = Math.max(...directions);
var min = Math.min(...directions);	// what about negative values??

	for (var i = 0; i < directions.length; i++) {
		var random_int = Math.floor(Math.random() * (max - min + 1) ) + min;
		if (directions_randomized.includes(random_int)) {
			i--;
		} 
		else {
			directions_randomized.push(random_int);
		}
	}
	return directions_randomized;
};