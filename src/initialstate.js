var constants = require("./constants"),
	React = require("react");

module.exports = function() { // Returns a function so it can't be modified accidentally
	return {
		input: {
			awaiting: constants.EXPECTING_NAME,
			previous: constants.EXPECTING_NAME,
			beforeReset: constants.EXPECTING_NAME,
			beforeResetIfConf: constants.EXPECTING_NAME
		},
		log: {
			messages: [
				{ speaker: constants.WIZARD, line: <p>Hey you there... yes you! The one with the funny... well everything! You're finally awake? Can you speak? Tell me your name.</p> },
			]
		},
		player: {
			name: "???",
			displayStats: false,
			stats: {

			},
			inventory: [],
			displayInventory: false,
			weapon: null,
			armour: null,
			position: {
				x: 0,
				y: 0
			}
		}
		//world: {
		//	seed: ""
		//}
	}
};