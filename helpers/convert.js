const _ = require('lodash');

module.exports = {
    fractionalToDecimal: function(fractString) {
        if (!fractString) return null;
            let fract_arr = fractString.split('/');
            let dec = _.parseInt((((fract_arr[0]) / (fract_arr[1])) + 1)*100, 10)/100;
        return dec;
    }
};
