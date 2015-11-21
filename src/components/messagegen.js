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
	getRaceMessage: function(name, classes) {

		var races = [];

		var firstLoop = true;

		// Loop through all races
		for (var raceName in classes) {
			if (classes.hasOwnProperty(raceName)) {
				var race = classes[raceName];
				var prefix = ("AEIOU".indexOf(race.name.charAt(0).toUpperCase()) < 0) ? "A" : "An";
				if (!firstLoop) {
					races.push(<font key={race.name}>{prefix} <font className={race.name}>{race.name}</font>? </font>);
				} else {
					races.push(<font key={race.name}>Are you {prefix.toLowerCase()} <font className={race.name}>{race.name}</font>? </font>);
					firstLoop = false;
				}
			}
		}

		var elf = <font className="Elf">Elf</font>;
		var human = <font className="Human">Human</font>;
		var dwarf = <font className="Dwarf">Dwarf</font>;
		return { speaker: "Wizard", line: <p>Alright then {name}, so what are you? {races}</p> };
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