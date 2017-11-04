'use strict';

const _ = require('lodash');
const rp = require('request-promise');

const URL = 'https://m.skybet.com/';


rp(URL)
.then((res) => {
    
    console.log(res);
})
.catch((err) => {
    console.log(err);
});



// module.exports = {
//     sayHelloInEnglish: function() {
//       return "HELLO";
//     },