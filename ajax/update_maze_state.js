/** TODO:
 * 
 * 1. capture json in server response & assign to object
 * 2. print json object to body
 * 3. See "Bypassing the cache"
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Cross-site_XMLHttpRequest
 */



function init() {
        makeRequest();
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
  }

