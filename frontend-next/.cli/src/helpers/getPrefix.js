const map = require('lodash/map');
const capitalize = require('./capitalize');

module.exports = function (action) {
    const parts = action.split('_');
    return map(parts, (p, i) => {
        if (i === 0) return '';
        return i > 1 ? capitalize(p) : p.toLowerCase();
    }).join('');
};
