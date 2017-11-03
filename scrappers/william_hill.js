'use strict';

const rp = require('request-promise');

const URL = 'https://mobet.williamhill.com/wap/bet/en-gb/betlive/9/Football.html?refPage=inPlay';


rp(URL)
.then((htmlString) => {
    console.log(htmlString);
})
.catch((err) => {
    console.log(err);
});