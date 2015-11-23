var _ = require("lodash");

var HelpList = [ require("./helpitems/equip.json"), require("./helpitems/reset.json"), require("./helpitems/lookat.json") ];

module.exports = _.sortBy(HelpList, "name");