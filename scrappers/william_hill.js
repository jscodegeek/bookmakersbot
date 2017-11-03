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
    const rows_league = dom.window.document.querySelectorAll('.content')[0].querySelectorAll('.heading');
    //remove heade Football
    const LEAGUES = _.map(_.values(rows_league), row => row.textContent.trim());

    //remove heade Football
    LEAGUES.shift();

 
    const rows = _.values(dom.window.document.querySelectorAll('.content')[0].querySelectorAll('tr'));

    let score = rows[3].querySelector('b').textContent.trim();
    let event = rows[4].textContent.trim();
    let oddWinFirst = rows[5].querySelector('.bold').textContent.trim();
    let oddDraw = rows[6].querySelector('.bold').textContent.trim();
    let oddWinSecond = rows[7].querySelector('.bold').textContent.trim();
    //console.log(rows[7].querySelector('.bold').textContent.trim());

    const result = [];
    let i = 0;
    while (i < rows.length) {
        let rowVal = rows[i].textContent.trim()
        if (_.includes(LEAGUES, rowVal)) {
            let league = rows[i].textContent.trim();
            do {
                let score = rows[i+2].querySelector('b').textContent.trim();
                let event = rows[i+3].textContent.trim();
                let home = event.split(' v ')[0];
                let away = event.split(' v ')[1];
                let oddHome = fractionalToDecimal(rows[i+4].querySelector('.bold').textContent.trim());
                let oddDraw = fractionalToDecimal(rows[i+5].querySelector('.bold').textContent.trim());
                let oddAway = fractionalToDecimal(rows[i+6].querySelector('.bold').textContent.trim());
                let match = {league, score, away, home, oddHome, oddDraw, oddAway};
                result.push(match);
                
                if ((i+9)<rows.length) {
                    let isLastMatchInLeague = _.includes(LEAGUES, rows[i+9].textContent.trim());
                } else {
                    let isLastMatchInLeague = true;
                }

                if (isLastMatchInLeague) {
                    i = i + 9;
                } else {
                    i = i + 8;
                }
            } while(!isLastMatchInLeague);
        } else {
            i++;
        }

        
    }
    console.log(result);
    console.log(result.length);
})
.catch((err) => {
    console.log(err);
});

const fractionalToDecimal = function (value) {
    let fract_arr = value.split('/');
    let dec = _.parseInt((((fract_arr[0]) / (fract_arr[1])) + 1)*100, 10)/100;
    return dec;
}

// module.exports = {
//     sayHelloInEnglish: function() {
//       return "HELLO";
//     },