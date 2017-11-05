var hash = require('quick-hash');

module.exports = {
  create: function(bookmakerName, league, homeTeam, awayTeam) {
    if (!bookmakerName || !league || !homeTeam || !awayTeam) {
        throw new Error('Create hashkey: all params should be here and not null');
    }

    return hash(bookmakerName + league + homeTeam + awayTeam);
  }
};