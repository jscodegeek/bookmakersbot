'use strict';

const _ = require('lodash');
const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const URL = 'https://mobet.williamhill.com/wap/bet/en-gb/betlive/9/Football.html?refPage=inPlay';


rp(URL)
.then((html) => {
    const dom = new JSDOM(html);
    //var rows = dom.window.document.querySelectorAll('.content')[0].querySelectorAll('tr');
    var rows_league = dom.window.document.querySelectorAll('.content')[0].querySelectorAll('.heading');

    //remove heade Football

    const LEAGUES = _.map(_.values(rows_league), row => row.textContent.trim());
    
    //remove heade Football
    LEAGUES.pop();

    console.log(LEAGUES);
 
    // if (rows[1].textContent.trim() === 'German Bundesliga') {
    //     console.log(11);
    // }

})
.catch((err) => {
    console.log(err);
});