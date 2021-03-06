/** TODO:
 * 

 * - render solution path after carving maze?
 * - mark starting and finish cells?
 * - load game buttons from json data? This would prevent hard-coding game URLS...
 * - Add pop-out feature
 * - Fading visited path
 * - Refactor getNeighbor. Cycle through an array rather than switch?
 * - remove alerts and implement error logging
 * - implement proper error handling
 */





/** Global Variables **/

// Number of rows and columns contained in the maze
var rows;
var cols;

// Two-dimensional index of cell ID's
// Initialized/reset, and made two-dimensional in initMaze()
var maze_index;

// Two-dimensional map storing bitwise values for each 
// cell indicating open doors.
// Initialized/reset, and made two-dimensional in initMaze()
var maze_map;

// Two-dimensional array containing cell tags
var maze_tags;

// Used by solve_maze() and getNeighbor() to track visited cells
// List is reset in the beginning of every iteration of update_loop(),
// and solve_init()
var visited_list;

// Using an enum simplifies the process of randomizing/shuffling
// directions to traverse.

var DIRECTION = Object.freeze({
    "N": 0,
    "S": 1,
    "E": 2,
    "W": 3
});

// Time between refresh cycles
var interval_ms =500;

// REST API to fetch maze state
var URL = 'http://maze.code-camp-2018.com/get/3:3:TinyTim';

// DEVELOPMENT SERVER
// var URL = 'http://localhost:8080/get/10:10:NewForm';

// only render maze on screen when json contains a new maze
// having a unique maze ID 
var current_maze_id = null;





/** Event listeners */

document.getElementById('game1').addEventListener("click", () => {
	URL = 'http://code-camp-2018.com/maze/3:3:TinyTim';
	//URL="http://localhost:8080/get/10:15:SimpleSample";	
});

document.getElementById('game2').addEventListener("click", () => {
	URL = 'http://code-camp-2018.com/maze/10:15:SimpleSample';
	//URL="http://localhost:8080/get/10:10:KrabbyKrust";
});

document.getElementById('game3').addEventListener("click", () => {
	URL = 'http://code-camp-2018.com/maze/50:50:HappyClam';
	// URL="http://localhost:8080/get/10:10:SnarkyShark";
});


document.getElementById('game4').addEventListener("click", () => {
	URL = 'http://code-camp-2018.com/maze/50:50:Tower%20of%20Power';
	//URL="http://localhost:8080/get/10:10:SlipperyDevil"; 
});



window.addEventListener("resize", () => {
	// Window resizes wont have to be timed to take
	// place after JSON is received, since maze (and thus cols)
	// will most likely have already been received
	maze_width = cols*30;
	resizeContainer(maze_width);
});


// EVENT CHAIN STARTS HERE
/** Function init() - kicks off the update loop
 * using setInterval
 */
function init() {
	
	setInterval(update_loop, interval_ms);
	
};




function update_loop() {  
	
    var request = new XMLHttpRequest();
    
    // TODO: implement better error checking
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
				// Render maze only when JSON contains a new one
				if (current_maze_id != mazeJson._id) {
					
					// Set/reset visited list 
					rows = 0;
					cols = 0;
					rows = Number(mazeJson.height);
					cols = Number(mazeJson.width);

					let maze_header = document.getElementById("maze_header");
					maze_header.innerHTML = mazeJson.seed + " <small>(" + mazeJson.height + " x " + mazeJson.width + ")</small>";
					// generate maze grid
					genMazeGrid(rows, cols);

					// carve maze
					carve_maze(mazeJson);

					// or carve a random maze (only one carve_maze function should be activated)
					// carve_maze_random("0x0");

					// assign current maze ID
					current_maze_id = mazeJson._id;

				}
			} 
			else {
            	alert("Unable to connect to server. \n\n Request status: " + request.status);
            }			
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

	maze_width = cols * 30;

	// initialize maze_map, maze_index, and maze_tags
	maze_index = [];
	maze_map = [];
	maze_tags = [];
	for (var i = 0; i < rows; i++) {
		maze_index.push(new Array(cols));
		maze_map.push(new Array(cols));
		maze_tags.push(new Array(cols));
		for (var j = 0; j < cols; j++) {
			maze_index[i][j] = 0;
			maze_map[i][j] = 0;
			maze_tags[i][j] = 0;
		}
	}

	
	
	maze_container = document.getElementById("maze_container");

	// reset maze_container (start with a clean slate)
	if (maze_container == null) {
		maze_container = document.createElement('div');
		maze_container.setAttribute("id", "maze_container");
		document.getElementById("main").appendChild(maze_container);
		maze_container.style.width = maze_width + "px";
		
		
	}
	else {
		maze_container.innerHTML = "";

	}
	
	// resize maze_container when maze is too large
	resizeContainer(maze_width);
 
	// Generate row marking the starting cell
	var start = document.createElement('div');
	start.setAttribute("class", "row");
	start.setAttribute("id", "start_mark_row");
	maze_container.appendChild(start);
	start.style.width = maze_width + "px";

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

  // Generate row marking the ending (finish) cell
	var finish = document.createElement('div');
	finish.setAttribute("class", "row");
	finish.setAttribute("id", "finish_mark_row");
	maze_container.appendChild(finish);
	finish.style.width = maze_width + "px";
}; // end genMazeGrid()

/** Function carve_maze(mazeJson), used when carving a maze
 * generated from JSON data.
 * 
 * @param mazeJson	JSON data containing a maze, and more specifically
 * needs the bitwise value for each cell indicating all assigned exits.
 */
function carve_maze(mazeJson) {
	// initialize maze
	for(var row = 0; row < rows; row++) {
		for (var col = 0; col < cols; col++) {
			maze_map[row][col] = mazeJson.cells[row][col].exits;
			maze_tags[row][col] = mazeJson.cells[row][col].tags;
			for (var i = 1; i <= 8; i*=2) {
				// carve passageways through the grid...
				if (maze_map[row][col] & i) {
					make_door(maze_index[row][col], i);
				}
				if (maze_tags[row][col] & i) {
					read_tags(maze_index[row][col], maze_tags[row][col]);
				}

			}

		}
	}



}


/** Function carve_maze_random(current_cell_index)
 * Carves a path from starting cell at 0x0 to a 
 * random endpoint. Used when carving a randomly generated
 * maze.
 * 
 * @param	current_cell_index	The index of the current cell
 * 					having form '1x4' where 1 is the row
 * 					number and 4 is the column number. 
 */
function carve_maze_random(current_cell_index) {

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
	            make_door_random(current_cell_index, new_cell_index, directions[i]);
	            carve_maze_random(new_cell_index);
	        }
	        else {	// neighboring cell is invalid. Try next.
				continue;
			}
	    }
}; // end carve_maze_random




/** Function getNeighbor(current_cell_index, direction)
 * Returns maze_index[][] index of current_cell_index's <direction> neighbor.
 * This function is only used for carving a random maze, but can be used to solve
 * any maze.
 * 
 * @param          current_cell_index	maze_index[][] index of current cell
 * @param          direction		Direction to look for neighbor.  
 * @return         new_cell_index	maze_index index of neighboring cell
 *									value is of form "row col" where 'row' and
 *									'col' are integers. Value is '-1x-1' if new
 * 									cell has already been visited, or cell does
 * 									not exist within the maze (out of bounds).							
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



function read_tags(current_cell_index, bitwise_tags) {
	if (bitwise_tags & 1) {			//	Start cell
		// mark starting cell...
		
		// mark using start_mark_row?
		// var temp = current_cell_index.split("x");
		// var tmp_col = Number(temp[1]);
		

		// add start cell to path
		document.getElementById(current_cell_index).className += " path";
	}
	else if (bitwise_tags & 2) {	// Finish cell
		// mark finish cell...

		// mark using finish_mark_row?
		// var temp = current_cell_index.split("x");
		// var tmp_col = Number(temp[1]);

		// add finish cell to path
		document.getElementById(current_cell_index).className += " path";
	}
	else if (bitwise_tags & 4) {	//	Path
		document.getElementById(current_cell_index).className += " path";
	}
}; // end read_tags(current_cell_index, bitwise_tags)

/** Function make_door(current_cell_index, bitwise_exits)
 * This function is called by carveMaze(mazeJSON), whereby
 * it iterates through each cell row by row, opening doors
 * as necessary. Since unique constituents can be determined
 * from any bitwise summation, all possible exits can be marked
 * using a single number, aka 'bitwise_exits'.
 */
function make_door(current_cell_index, bitwise_exits) {

		if (bitwise_exits & 1) {	//	north open
			document.getElementById(current_cell_index).className +=" openNorth";
		}
		else if (bitwise_exits & 2) {	//	north open
			document.getElementById(current_cell_index).className +=" openSouth";
		}
		else if (bitwise_exits & 4) {	//	north open
			document.getElementById(current_cell_index).className +=" openEast";
		}
		else if (bitwise_exits & 8) {	//	north open
			document.getElementById(current_cell_index).className +=" openWest";
		}	
};	// end make_door(current_cell_index, bitwise_exits)

/** Function make_door_random(current_cell_index, new_cell_index, direction)
 * This function performs two things: 
 * 	1) Makes a door between two cells. 
 * 	2) Cells are mapped using a bitwise value (maze_map[][]);
 * 
 *
 * @param	current_cell_index	index of starting cell
 * @param	new_cell_index		index of ending cell
 * @param	direction		    direction to open door leading
 *                              out of current cell.
 */
function make_door_random(current_cell_index, new_cell_index, direction) {
	
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
			// Make door between two adjacent cells
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

    
    
};	// end make_door_random()


/** Function solve_init()
 * This function resets the visited list, and passes the starting
 * cell to solve_maze, effectively kicking off the maze solving 
 * process. Since the solving algorithm is a recursive
 * solution, the visited list needs to be set before the solve_maze 
 * is called.*/
function solve_init() {
    visited_list = ["0x0"] ;	//	reset visited_list to be used with solve_maze
    
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

		// TODO: Consider looping through bitwise values to prevent repetition
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



// ****************************
/** Helper/Utility functions **/
// ****************************



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



/** Function resizeContainer(maze_width) 
 * called whenever the maze needs to be resized to fit it's container, 
 * such as when resizing the browser window, or rendering a maze 
 * larger than the parent container 'main'. Smaller mazes on the 
 * other hand are not expanded to fill the parent container.
 * 
 * @param maze_width	The width, in pixels, of the maze itself. 
 * This value is used to determine the ratio of the widths belonging to
 * the maze and its parent container, which translates to the zoom level
 * necessary to fit the maze inside 97% of the parent container. Note: 97% 
 * is arbitrary and merely allows a little extra elbow room .
 * 
 * 
 * ---> Also note, that even though 'cols' is global in scope, relying on a global 
 * value can result in a race condition where resizeContainer is called before 
 * the update_loop has a chance to complete, which may result in resizeContainer
 * pulling a value from 'cols' before it is set in the update_loop (ie when a new maze arrives in JSON.)
 * 
 * Pulling a value from the global 'cols' in the window resize event listener will likely be fine 
 * since it doesnt trigger a change in any values.
 */
function resizeContainer(maze_width) {

	// Width of parent container of maze_container
	let parent_width = parseInt(window.getComputedStyle(document.getElementById("main"), null).getPropertyValue("width"), 10);
	
	// zoom to fit if maze is too large
	if (maze_width > parent_width) {
		// zooms to fit 97% the width of parent container, 
		// keeping aspect ratio 
		let zoom_value = ((parent_width / maze_width)*97).toFixed(3).toString() + "%";
		maze_container.style.zoom = zoom_value;
	}
	else {
		maze_container.style.zoom = "100%";
	}
}; // end resizeContainer
