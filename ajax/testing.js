// testing script
function init() {
    setInterval(myLoop, 1000);

    function myLoop() {

    

        if(document.getElementById("maze_container")!=null){

            console.log("already exists");
        }
        else {
            maze_container = document.createElement('div');
            maze_container.setAttribute("id", "maze_container");
            maze_container.style.backgroundColor = "red";
            maze_container.style.height = 10;
            maze_container.style.width = 10;
            document.body.appendChild(maze_container);
        }

    }
}