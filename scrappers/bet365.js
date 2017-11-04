'use strict';

const _ = require('lodash');
const co = require('co');
const rp = require('request-promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const convert = require('../helpers/convert');
const hashKey = require('../helpers/hashKey');

const driver = require('node-phantom-promise');
const phantomjs = require('phantomjs');
const sleep = require('sleep-promise');

const URL = 'https://mobile.bet365.com/#type=InPlay;key=;ip=1;lng=1';


const run = co.wrap(function*() {
    const start = (new Date()).getTime();

    const browser = yield driver.create({path: phantomjs.path});

    const page = yield browser.createPage();

    yield page.open(URL); 

    yield sleep(15000);
    
    const result = [];
    
    const response = yield page.get('content');

    browser.exit();

    const dom = new JSDOM(response);
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
            let oddHome = convert.fractionalToDecimal(_.get(odds[0], 'textContent', null));
            let oddDraw = convert.fractionalToDecimal(_.get(odds[1], 'textContent', null));
            let oddAway = convert.fractionalToDecimal(_.get(odds[2], 'textContent', null));

            let key = hashKey.create('Bet365', league, home, away);

            let match = {key, league, home, away, score, oddHome, oddDraw, oddAway}
            result.push(match);
        });
    });    

    const end = (new Date()).getTime();
        
    console.log('Bet365: ', end - start);

    return result;

});

module.exports = { run };