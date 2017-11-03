'use strict';

const _ = require('lodash');
const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const URL = 'https://www.bet365.com/#/IP/';


rp(URL)
.then((html) => {
   console.log(html);
})
.catch((err) => {
    console.log(err);
});

const fractionalToDecimal = function (value) {
    var fract_arr = value.split('/');
    var dec = _.parseInt((((fract_arr[0]) / (fract_arr[1])) + 1)*100, 10)/100;
    return dec;
}

// module.exports = {
//     sayHelloInEnglish: function() {
//       return "HELLO";
//     },