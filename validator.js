'use strict';
require('dotenv').config({path: '.env'});
var validator = {

    isValidURL : function(url_string) {
        let regex = new RegExp(/(https:\/\/|http:\/\/|ftp:\/\/){1}([a-z]{1,3})+([\_\-\.]{1}[a-z0-9]+)*\.([a-z]{2,3}){1}/g);
        if (regex.test(url_string)) {
            return true;
        }
        else {
            console.log(url_string + ' --> Error: isValidURL() requires the following:\n ' + 
            '\t- Valid web protocol (e.g. https, http, ftp)\n' +
            '\t- Valid domain extension (e.g. \'.com\', \'.org\', \'.ca\')  \n' + 
            '\t- Domain names may only include valid characters (e.g. _,-,.,a-z,0-9)');
            return false;
        }
    },
   


    isValidDomain : function(url_string) {
        const DOMAIN_WHITELIST = process.env.DOMAIN_WHITELIST.split(',');
        let temp = '';
        let regex = new RegExp(/([a-z]{1,3})+([\_\-\.]{1}[a-z0-9]+)*\.([a-z]{2,3}){1}/g);
        if (regex.test(url_string)) {
            temp = url_string.match(regex)[0];
            if (DOMAIN_WHITELIST.includes(temp)) {
                return true;
            } 
            else {
                console.log('Error: isValidDomain() requires that urls contain a domain that is whitelisted\n' + 
                            '\t--> ' + url_string + ' [not whitelisted]');
            }
        }
        else {
            console.log(url_string + ' --> Error: isValidDomain() requires the following:\n ' + 
                        '\t- Valid domain extension (e.g. \'.com\', \'.org\', \'.ca\')  \n' + 
                        '\t- Domain names may only include valid characters (e.g. _,-,.,a-z,0-9)');
            return false;

        }
    }
}

module.exports = validator;



