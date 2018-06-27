/* * 
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
    "hostname" : "maze-service-code-camp.a3c1.starter-us-west-1.openshiftapps.com",
    "port" : null,
    // "path" : `/get/${HEIGHT}/${WIDTH}/${SEED}`
    "path" : `/get`
    
};

// req is assigned an instance of http.ClientRequest class
var req = http.request(options, function (res) {
    var chunks = [];
    console.log(res.statusCode);
    // Event listener for 'data' 
    // The chunk emitted in each 'data' event is a Buffer.
    res.on("data", function (chunk) {
        chunks.push(chunk);
    });
    // ... At the 'end', concatenate and stringify it.
    res.on("end", function () {
        var jsonObj1 = Buffer.concat(chunks);
        console.log(typeof(jsonObj1));
        
        var jsonObj = JSON.parse(jsonObj1);
        console.log(typeof(jsonObj));

        var jsonObj2 = JSON.parse(jsonObj);
        console.log(typeof(jsonObj2));
    
        for (var key in jsonObj2) {
            if (jsonObj2.hasOwnProperty(key)) {
              var val = jsonObj2[key];
              console.log(val);
            }
          }

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

