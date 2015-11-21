var constants = require("./../constants");

module.exports = {
	getConfirmMessage: function(prevInput) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: "Great! Then I'll call you %NAME% from now on." };
		}
	},
	getDenyMessage: function(prevInput) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: "Alright, how about we try this again. What is your name?" };
		}
	},
	getFailMessage: function(prevInput) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: "I'm sorry, I have no idea what you're trying to say... It's a yes or no question!" };
		}
	}
};