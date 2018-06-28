/** TODO:
 * 
 * 1. capture json in server response & assign to object
 * 2. print json object to body
 * 3. See "Bypassing the cache"
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Cross-site_XMLHttpRequest
 */

/** Global Variables **/

// Index of cell ID's
// Made two-dimensional in init()
var maze_index = [];

// Number of rows and columns contained in the maze
var rows;
var cols;

// Stores bitwise values for each cell indicating open doors
// Made two-dimensional in init()
var maze_map = [];




function init() {
        makeRequest();

         // get inputs
    rows = 10;
    cols = 10;

    // initialize maze map
    for (var i = 0; i < rows; i++) {
        maze_index.push(new Array(cols));
        maze_map.push(new Array(cols));
        for (var j = 0; j < cols; j++) {
            maze_index[i][j] = 0;
            maze_map[i][j] = 0;
        }
    }

    // Generate grid
    gen_maze(rows, cols);


};


function makeRequest() {
    var request = new XMLHttpRequest();

    
    // Primitve error checking
    if (!request) {
      alert('Unable to create instance of request');
      return false;
    }

    
    request.onreadystatechange = alertContents;
    request.open('GET', 'http://maze-service-code-camp.a3c1.starter-us-west-1.openshiftapps.com/get/10:15:SimpleSample');
    request.responseType='json';
    request.send();

    function alertContents() {

        // readyState values:
        // 0 (uninitialized) or (request not initialized)
        // 1 (loading) or (server connection established)
        // 2 (loaded) or (request received)
        // 3 (interactive) or (processing request)
        // 4 (complete) or (request finished and response is ready)
    
        if (request.readyState === request.DONE) {
            alert(request.readyState);
          if (request.status === 200) {
              
            // assign json to element.innerHTML
            
            var superHeroesText = request.response;
            alert(JSON.stringify(superHeroesText));
            // var superHeroes = JSON.parse(superHeroesText);
          } else {
            alert(request.status)
          }
        }
      }
  };



/** Function gen_maze(rows, cols)
 * Generates a grid of cells which form the fundamental
 * structure of a maze.
 * 
 * @param	rows	Number of rows to include in the grid.
 * @param	cols	Number of columns to include in the grid.
 * 
 * 
 */

function gen_maze(rows, cols) {
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
} // end gen_maze()