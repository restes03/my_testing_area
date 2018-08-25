'use strict';
/** isValidator.js - Small module for validating URL strings
 * 
 * @author: Russell Estes estex198@gmail.com
 * 
 */



// replace with fs read?
require('dotenv').config({path: '.env'});
var url = require('url');






var validator = {

    isValidURL : function(url_string) {
        let regex = new RegExp(/(https:\/\/|http:\/\/|ftp:\/\/){1}([a-z]{1,3})+([\_\-\.]{1}[a-z0-9]+)*\.([a-z]{2,3}\b){1}/g);
        if (regex.test(url_string)) {
            return true;
        }
        else {
            console.log('Error: Invalid URL string: isValidURL() requires the following:\n ' + 
            '\t- Valid web protocol (limited to: https, http, ftp)\n' +
            '\t- Valid domain extension (e.g. \'.com\', \'.org\', \'.ca\', etc...)  \n' + 
            '\t- Domain names may only include the following characters (\'_\',\'-\',\'.\',a-z,0-9)\n' +
            '\t[' + url_string + '] --> Invalid URL string');
            return false;
        }
    },
   


    isValidDomain : function(url_string) {
        const DOMAIN_WHITELIST = process.env.DOMAIN_WHITELIST.split(',');
        let temp;
        let regex = new RegExp(/([a-z]{1,3})+([\_\-\.]{1}[a-z0-9]+)*\.([a-z]{2,3}){1}/g);
        if (regex.test(url_string)) {
            temp = url.parse(url_string);
            // temp = url_string.match(regex)[0];
            if (DOMAIN_WHITELIST.includes(temp.hostname)) {
                return true;
            } 
            else {
                console.log('Error: Invalid domain in URL string: isValidDomain() requires that urls contain a domain that is whitelisted\n' + 
                            '\t ' + temp.hostname + ' --> Not whitelisted');
            }
        }
        else {
            console.log('Error: Invalid domain in URL string: isValidDomain() requires the following:\n ' + 
                        '\t- Valid domain extension (e.g. \'.com\', \'.org\', \'.ca\')  \n' + 
                        '\t- Domain names may only include valid characters (e.g. _,-,.,a-z,0-9)\n' +
                        '\t[' + url_string + '] --> Invalid domain');
        }
        return false;
    }
}

module.exports = validator;
