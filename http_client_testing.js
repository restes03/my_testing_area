const http = require('http');
 
http.get('http://localhost:8080/api/maze/generate/5/5/hello', (resp) => {
  let data = '';
  console.log("Response status code: " + resp.statusCode);
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    console.log("chunk received");
    data += chunk;
  });
  
  // The whole response has been received. Print out the result.
  resp.on('end', () => {

    // console.log(resp.statusCode);
    console.log(resp.headers);
      if (typeof data == 'string') {
          if (data == '') {
              console.log("empty JSON string");
          }
      }
      else if (typeof data == 'object') {
          console.log("object");
      }
      else {
          console.log("other...");
      }
    // console.log(data);
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});