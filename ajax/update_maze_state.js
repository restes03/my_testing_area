/** TODO:
 * 
 * 1. get height and length before generating the maze
 * 2. determine which variables are needed before proceeding
 * 3. carve maze
 * 4. solve maze
 * 10. fix error handling
 */



/** Global Variables **/

// Index of cell ID's
// Made two-dimensional in init()
var maze_index = [];

// Stores bitwise values for each cell indicating open doors
// Made two-dimensional in init()
var maze_map = [];

// Time between refresh cycles
var timeout = 500;


// Number of rows and columns contained in the maze
var rows;
var cols;

// REST URL from which to fetch data
var URL = 'http://maze-service-code-camp.a3c1.starter-us-west-1.openshiftapps.com/get/10:15:SimpleSample';






function init() {
    
    setInterval(update_loop, 1000);

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
            genMaze(rows, cols);
            
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

/** Function genMaze(rows, cols)
 * Generates a grid of cells which form the fundamental
 * structure of a maze.
 * 
 * @param	rows	Number of rows to include in the grid.
 * @param	cols	Number of columns to include in the grid.
 * 
 * 
 */

function genMaze(rows, cols) {
  // cells are 30px each having left and right borders
  // of 1px each. Total maze width is then:
  maze_width = cols * 32;

  // create fill area to insert cells,
  // then set id & class
  var maze_container = document.createElement('div');
  maze_container.setAttribute("id", "maze_container");
  document.body.appendChild(maze_container);
  document.body.replaceChild(maze_container, maze_container);
  maze_container.style.width = maze_width + "px";

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
}; // end genMaze()