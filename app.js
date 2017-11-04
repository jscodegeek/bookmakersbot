// const express = require('express')
// const app = express()
// const path    = require("path");

// app.use(express.static('public'));

// app.listen(5000, function () {
//   console.log('BookmakersBot app listening on port 5000!')
// })

const paddyPowerScrapper = require('./scrappers/paddy_power');
const williamHillScrapper = require('./scrappers/william_hill');
const bet365Scrapper = require('./scrappers/bet365');

// paddyPowerScrapper.run()
//   .then(response => console.log(response));

// williamHillScrapper.run()
//   .then(response => console.log(response));

bet365Scrapper.run()
.then(response => console.log(response));