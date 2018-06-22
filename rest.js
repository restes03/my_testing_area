/** 
 * http.request api: https://nodejs.org/api/http.html#http_http_request_options_callback 
*/



// requires Node.js http module
var http = require('http');

/** Need to sub in variables for h, w, and seed values below in path */
const HEIGHT = 0;
const WIDTH = 0;
const SEED = "";


var options = {
    "method" : "GET",
    "hostname" : "localhost",
    "port" : 8080,
    "path" : `/api/maze/generate/${HEIGHT}/${WIDTH}/${SEED}`
    
};

// req is assigned an instance of http.ClientRequest class
var req = http.request(options, function (res) {
    var chunks = [];
    console.log(res.statusCode);
    res.on("data", function (chunk) {
        
        chunks.push(chunk);
    });
    res.on("end", function () {
        var body = Buffer.concat(chunks);
        
        console.log(body.toString());
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  /** With http.request() one must always call req.end() 
   * to signify the end of the request - even if there is 
   * no data being written to the request body. 
   */
req.end();

