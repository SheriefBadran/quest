var constants = require("./../constants");

module.exports = {
	getConfirmMessage: function(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: "Great! Then I'll call you " + name + " from now on." };
		}
	},
	getDenyMessage: function(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: "Alright, how about we try this again. What is your name?" };
		}
	},
	getFailMessage: function(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: "I'm sorry, I have no idea what you're trying to say... It's a yes or no question!" };
		}
	},
	getPlayerYes: function() {
		return { speaker: "Player", line: "Yes." };
	},
	getPlayerNo: function() {
		return { speaker: "Player", line: "No." };
	},
	getPlayerFail: function() {
		return { speaker: "Player", line: "*incomprehensible garbling*" };
	}
};