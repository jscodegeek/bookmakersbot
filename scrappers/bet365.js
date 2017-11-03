'use strict';

const _ = require('lodash');
const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const URL = 'https://www.bet365.gr/?lng=1&cb=10581203114#/IP/';

rp(URL)
.then((html) => {
    
    console.log(html);
})
.catch((err) => {
    console.log(err);
});


// var webdriver = require('selenium-webdriver');
// var chrome = require('selenium-webdriver/chrome');
// var path = require('chromedriver').path;

// var service = new chrome.ServiceBuilder(path).build();
// chrome.setDefaultService(service);

// var driver = new webdriver.Builder()
//     .withCapabilities(webdriver.Capabilities.chrome())
//     .build();


// const t = driver.get(URL);
// console.log(11111);
// console.log(t);



// const {Builder, By, Key, until} = require('selenium-webdriver');

// let driver = new Builder()
//     .forBrowser('chrome')
//     .build();

// driver.get('http://www.google.com/ncr');
// driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.quit();

const fractionalToDecimal = function (value) {
    var fract_arr = value.split('/');
    var dec = _.parseInt((((fract_arr[0]) / (fract_arr[1])) + 1)*100, 10)/100;
    return dec;
}




// module.exports = {
//     sayHelloInEnglish: function() {
//       return "HELLO";
//     },