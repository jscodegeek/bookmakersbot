'use strict';

const _ = require('lodash');
const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const driver = require('node-phantom-promise');
const phantomjs = require('phantomjs');
const sleep = require('sleep-promise');


const URL = 'https://mobile.bet365.com/#type=InPlay;key=;ip=1;lng=1';

!async function () {
    const browser = await driver.create({path: phantomjs.path})
  
    const page = await browser.createPage()
  
    const status = await page.open(URL)
  
    //console.log('opened site? ', status)
  

    await sleep(15000)
  
    const result = [];
    await page.get('content',  (err, html) => {
        const dom = new JSDOM(html);
        const rows = dom.window.document.querySelectorAll('.ipo-CompetitionBase:not(.ipo-Competition_EventLink)');
 

        _.each(rows, row => {
            let league = row.querySelector('.ipo-Competition_Name').textContent;

            let events_in_league = row.querySelectorAll('.ipo-Fixture_TimedFixture');
            _.each(events_in_league, event => {
                let teams = event.querySelectorAll('.ipo-Fixture_Truncator');
                let home = teams[0].textContent
                let away = teams[1].textContent;

                let score_vals = event.querySelectorAll('.ipo-Fixture_PointField ');
                let score = `${score_vals[0].textContent}-${score_vals[1].textContent}`;

                let odds = event.querySelectorAll('.ipo-Participant_OppOdds');
                let oddHome = fractionalToDecimal(_.get(odds[0], 'textContent', null))
                let oddDraw = fractionalToDecimal(_.get(odds[1], 'textContent', null))
                let oddAway = fractionalToDecimal(_.get(odds[2], 'textContent', null))

                let match = {league, home, away, score, oddHome, oddDraw, oddAway}
                result.push(match);

            });             
        });
        console.log(result);
        

        browser.exit()

        
    });
    
  }().catch((err) => {
    console.error(err.stack)
  });

  const fractionalToDecimal = function (value) {
    if (!value) return null;
    let fract_arr = value.split('/');
    let dec = _.parseInt((((fract_arr[0]) / (fract_arr[1])) + 1)*100, 10)/100;
    return dec;
}


