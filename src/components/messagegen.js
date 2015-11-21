var constants = require("./../constants"),
	React = require("react");

module.exports = {
	getConfirmMessage: function(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: <p>Great! Then I'll call you {name} from now on.</p> };
		}
	},
	getDenyMessage: function(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: <p>Alright, how about we try this again. What is your name?</p> };
		}
	},
	getFailMessage: function(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				var yes = <font className="confirm">yes</font>;
				var no = <font className="deny">no</font>
				return { speaker: "Wizard", line: <p>I'm sorry, I have no idea what you're trying to say... It's a {yes} or {no} question!</p> };
		}
	},
	getPlayerYes: function() {
		return { speaker: "Player", line: <p>Yes.</p> };
	},
	getPlayerNo: function() {
		return { speaker: "Player", line: <p>No.</p> };
	},
	getPlayerFail: function() {
		return { speaker: "Player", line: <p>*incomprehensible garbling*</p> };
	}
};