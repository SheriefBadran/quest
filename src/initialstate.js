var constants = require("./constants");

module.exports = function() { // Returns a function so it can't be modified accidentally
	return {
		input: {
			awaiting: constants.EXPECTING_NAME,
			previous: constants.EXPECTING_NAME
		},
		log: {
			messages: [
				{ speaker: "Wizard", line: "Hey you there... yes you! The one with the funny... well everything! You're finally awake? Can you speak? Tell me your name." },
			]
		},
		player: {
			name: "???"
		}
	}
};