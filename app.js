const express = require('express')
const app = express()
const path    = require('path');

app.use(express.static('public'));


const co = require('co');
const wuzzy = require('wuzzy');

const paddyPowerScrapper = require('./scrappers/paddy_power');
const williamHillScrapper = require('./scrappers/william_hill');
const bet365Scrapper = require('./scrappers/bet365');

app.get('/api/scrapper', function (req, res) {
  co(function* () {
    const paddyPowerEvents  = yield paddyPowerScrapper.run();
    const williamHillEvents = yield williamHillScrapper.run();
    const bet365EventsList = yield bet365Scrapper.run();
 
    //const paddyPowerEvents  = JSON.parse(paddyPowerResp);
    //const williamHillEvents = JSON.parse(williamHillResp);
    
    const bet365AndWhAndPPList = [];
    bet365EventsList.forEach(bEvent => {
      let max_k = 0;
      let max_event = null;
      let max_index = -1;
      williamHillEvents.forEach((whEvent, index) => {
        const league_k = wuzzy.jarowinkler(bEvent.league, whEvent.league);
        const home_k = wuzzy.jarowinkler(bEvent.home, whEvent.home);
        const away_k = wuzzy.jarowinkler(bEvent.away, whEvent.away);
        const sum_k = league_k + home_k + away_k;

        if ( (sum_k > max_k) && (sum_k > 1.8) && (bEvent.score === whEvent.score)) {
          max_k = sum_k;
          max_event = whEvent;
          max_index = index;
        }
      });

      if (max_index > -1) { williamHillEvents.splice(max_index, 1); }

      bet365AndWhAndPPList.push({bet365: bEvent, williamHill: max_event});
    });



    bet365AndWhAndPPList.forEach(bEvent => {
      let max_k = 0;
      let max_event = null;
      let max_index = -1;
      paddyPowerEvents.forEach((ppEvent, index) => {
        const league_k = wuzzy.jarowinkler(bEvent.bet365.league, ppEvent.league);
        const home_k = wuzzy.jarowinkler(bEvent.bet365.home, ppEvent.home);
        const away_k = wuzzy.jarowinkler(bEvent.bet365.away, ppEvent.away);
        const sum_k = league_k + home_k + away_k;

        if ( (sum_k > max_k) && (sum_k > 1.8)) {
          max_k = sum_k;
          max_event = ppEvent;
          max_index = index;
        }

        
      });

       
      if (max_index > -1) {
          williamHillEvents.splice(max_index, 1);
          bEvent['paddyPower'] = max_event;
      }

    });






    
    res.json(bet365AndWhAndPPList);
  });
})

app.listen(5000, function () {
  console.log('BookmakersBot app listening on port 5000!')
})



// paddyPowerScrapper.run()
//   .then(response => console.log(response));

// williamHillScrapper.run()
//   .then(response => console.log(response));

// bet365Scrapper.run()
// .then(response => console.log(response));


