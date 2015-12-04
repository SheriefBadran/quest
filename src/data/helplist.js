import _ from "lodash";

let HelpList = [ 
	require("./helpitems/equip.json"), 
	require("./helpitems/reset.json"), 
	require("./helpitems/lookat.json"),
	require("./helpitems/north.json"),
	require("./helpitems/east.json"),
	require("./helpitems/south.json"),
	require("./helpitems/west.json"),
	require("./helpitems/lookaround.json")
	];


module.exports = _.sortBy(HelpList, "name");