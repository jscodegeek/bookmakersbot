'use strict';

const _ = require('lodash');
const co = require('co');
const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const convert = require('../helpers/convert');
const hashKey = require('../helpers/hashKey');

const URL = 'https://mobet.williamhill.com/wap/bet/en-gb/betlive/9/Football.html?refPage=inPlay';


const run = co.wrap(function* () {
    const start = (new Date()).getTime();

    const response  = yield rp(URL);

    const dom = new JSDOM(response);
    
    const rows_league = dom.window.document.querySelectorAll('.content')[0].querySelectorAll('.heading');
        
    const LEAGUES = _.map(_.values(rows_league), row => row.textContent.trim());
    
    LEAGUES.shift(); //remove heade Football
    
    const rows = _.values(dom.window.document.querySelectorAll('.content')[0].querySelectorAll('tr'));
    
        const result = [];
        let i = 0;

        while (i < rows.length) {
            let rowVal = rows[i].textContent.trim()
            if (_.includes(LEAGUES, rowVal)) {
                let league = rows[i].textContent.trim();
                let old_i = i;
                do {
                    try {
                        if(rows[i+3].textContent.includes(' v ')){
                            let score = rows[i+2].querySelector('b').textContent.trim();
                            let event = rows[i+3].textContent.trim();
                            let home = event.split(' v ')[0];
                            let away = event.split(' v ')[1];
                            let oddHome = convert.fractionalToDecimal(rows[i+4].querySelector('.bold').textContent.trim());
                            let oddDraw = convert.fractionalToDecimal(rows[i+5].querySelector('.bold').textContent.trim());
                            let oddAway = convert.fractionalToDecimal(rows[i+6].querySelector('.bold').textContent.trim());
                            
                            let key = hashKey.create('William Hill', league, home, away);
    
                            let match = {key, league, score, away, home, oddHome, oddDraw, oddAway};
                            result.push(match);
                            
                            if ((i+9)<rows.length) {
                                var isLastMatchInLeague = _.includes(LEAGUES, rows[i+9].textContent.trim());
                            } else {
                                var isLastMatchInLeague = true;
                            }
            
                            if (isLastMatchInLeague) {
                                i = i + 9;
                            } else {
                                i = i + 8;
                            }
                        } 
                    }
                    catch(e) {
                        console.log(e);
                    } 
                    finally {
                        i=old_i+1;
                        break;
                    }
                    
                } while(!isLastMatchInLeague);
            } else {
                i++;
            }
        }
    
    const end = (new Date()).getTime();
        
    console.log('William Hill: ', end - start);

    return result;
        
});

module.exports = { run };