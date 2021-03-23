//Something general later here
//I am thinking about the Current Time should be put here

const tablize = require('jsontostringtable');


module.exports = {
    convertJsonToTable: (jsonString) => {
        return tablize(jsonString);
    }
}