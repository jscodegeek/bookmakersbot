'use strict';

const _ = require('lodash');
const co = require('co');
const rp = require('request-promise');
const hashKey = require('../helpers/hashKey.js');

const URL = 'https://sports.paddypower.mobi/tps/live';

const run = co.wrap(function* () {
    const start = (new Date()).getTime();

    const response = yield rp(URL); 

    let data = JSON.parse(response);
    let sports = data.sports
    let football = _.find(sports, { 'id': 49 });
    let competitions = football.competitions;

    let result = [];

    _.each(competitions, comp => {
        let league = comp.title;
            let event = comp.events[0];
        let away = event.awayName;
        let home = event.homeName;
            let outcomes = event.markets[0].outcomes
        let oddHome = outcomes[0].oddsDecimal;
        let oddDraw = outcomes[1].oddsDecimal;
        let oddAway = outcomes[2].oddsDecimal;

        let key = hashKey.create('Paddy Power', league, home, away);

        let match = {key, league, score: null, away, home, oddHome, oddDraw, oddAway};
        result.push(match);
    });
    
    const end = (new Date()).getTime();

    //console.log('Paddy power time: ', end - start);

    return result;
  });

 
module.exports = { run };





// rp(URL)
// .then((res) => {
//     let data = JSON.parse(res);
//     let sports = data.sports
//     let football = _.find(sports, { 'id': 49 });
//     let competitions = football.competitions;

//     let result = [];

//     _.each(competitions, comp => {
//         let league = comp.title;
//             let event = comp.events[0];
//         let away = event.awayName;
//         let home = event.homeName;
//             let outcomes = event.markets[0].outcomes
//         let oddHome = outcomes[0].oddsDecimal;
//         let oddDraw = outcomes[1].oddsDecimal;
//         let oddAway = outcomes[2].oddsDecimal;

//         let key = hashKey.create(league, home, away);

//         let match = {key, league, score: null, away, home, oddHome, oddDraw, oddAway};
//         result.push(match);
//     });
//     console.log(result);
// })
// .catch((err) => {
//     console.log(err);
// });



// module.exports = {
//     sayHelloInEnglish: function() {
//       return "HELLO";
//     },