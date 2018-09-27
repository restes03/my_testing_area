'use strict'
/** http-request.js - Small module for sending http requests
 * 
 * @author: Russell Estes estex198@gmail.com
 */

const https = require('https');
const url = require('url');

var makeHttpRequest = {
    
    get: function getRequest(urlStr, user, pass, callback) {

        if (urlStr != undefined) {
            const urlQuery = url.parse(urlStr);
            console.log('Request --> ' + urlQuery.href);
            let auth = (user && pass) ? 'Basic ' + new Buffer(user + ':' + pass).toString('base64') : undefined;
            let options = {
                hostname: urlQuery.hostname,
                protocol: urlQuery.protocol,
                port: urlQuery.port || 443,
                path: urlQuery.path,
                method: 'GET',  
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': auth || ':'
                },
                rejectUnauthorized: false
            };





            let req = https.request(options, function (response) {
                response.setEncoding('utf8');
            
                let body = '';
            
                response.on('data', function (chunk) {
                    body = body + chunk;
                });
            
                response.on('end',function(){
                    console.log('Status --> ' + response.statusCode);
                    callback(response);
                }); // end response.on('end')
        
            }); // end req = https.request()
        
            req.on('error', function (e) {
                console.log(e);
                let error = {statusCode: 'error', message: e}
                callback(error);
            });
        
            // write data to request body
            req.end();
        }

    }   // end getRequest()
}

module.exports = makeHttpRequest;
