'use strict';
/** validator.js - Small module for validating URL strings obtained from user input
 * 
 * @author: Russell Estes estex198@gmail.com
 */


// replace with fs read?
require('dotenv').config({path: '.env'});
var url = require('url');

var validator = {

    hasValidProtocol : function(url_string) {
        let regex = new RegExp(/(^https:\/\/\b){1}/);
        if (regex.test(url_string)) {
            return true;
        }
        else throw new Error('Valid web protocols limited to https!\n');
    },

    hasValidDomain : function(url_string) {
        const DOMAIN_WHITELIST = process.env.DOMAIN_WHITELIST.split(',');
        let temp;
        let regex = new RegExp(/([a-z]{1,3})+([\_\-\.]{1}[a-z0-9]+)*\.([a-z]{2,3}\b){1}/);
        if (regex.test(url_string)) {
            temp = url.parse(url_string);
            if (DOMAIN_WHITELIST.includes(temp.hostname)) {
                return true;
            } 
            else throw new Error('Domain not whitelisted: ' + temp.hostname);
        }
        else throw new Error('Invalid URL or domain not whitelisted\n\n\n' +
                        '\t\tDomain must include: \n\n' + 
                        '\t\t\t- Valid domain extension (e.g. \'.com\', \'.org\', \'.ca\')  \n' + 
                        '\t\t\t- Valid characters:\n' +
                            '\t\t\t\t- Letters (upper/lower)\n' + 
                            '\t\t\t\t- Integers (0-9)\n' + 
                            '\t\t\t\t- Underscores ( _ )\n' + 
                            '\t\t\t\t- Hyphens ( - )\n');

    },


    hasValidPathName : function (url_string) {
        let regex = new RegExp(/\.([a-z]{2,3}\b){1}((\/){1}[a-zA-Z0-9\_\-\?\&\=]+\b)+/);
        if (regex.test(url_string)) {
            return true;
        }
        else throw new Error('URL pathnames may only include the following characters:\n' + 
                        '\t- Letters (upper/lower)\n' + 
                        '\t- Integers (0-9)\n' + 
                        '\t- Non-alphanumeric characters:\n' +
                        '\t\t- Underscores ( _ )\n' + 
                        '\t\t- Hyphens ( - )\n' +
                        '\t\t- Ampersand ( & )\n' +
                        '\t\t- Equals ( = ) \n' +
                        '\t\t- Question mark ( ? )\n');


    },


    hasNoInvalidChars : function(url_string) {
        let regex = new RegExp(/[\%\<\>\@\#\$\^\*\(\)\{\}\[\]\|\'\"\;\+\,\`\\]/g);
        if (regex.test(url_string)) {
            throw new Error('URL string may not include the following characters: \n\n' + 
            '\t\t-->\t%   < > @ # $ ^ * ( ) { } [ ] | \' " ; + , \` \\ \n');
        }
        else return true;
    }

}

module.exports = validator;
