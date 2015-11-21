var constants = require("./../constants"),
	React = require("react");

module.exports = {
	getConfirmMessage: function(prevInput, name, option="") {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: <p>Great! Then I'll call you {name} from now on.</p> };
			case constants.EXPECTING_RACE:
				return { speaker: "Wizard", line: <p>Excellent! At least it seems you're sure of something...</p> };
			default:
				console.log("Missing confirm message for " + prevInput);
				return { speaker: "Narrator", line: <p>Whoops! Looks like some sort of error occurred... silly me!</p> };
		}
	},
	getDenyMessage: function(prevInput, name, options) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: "Wizard", line: <p>Alright, how about we try this again. What is your name?</p> };
			case constants.EXPECTING_RACE:
				return this.getRaceMessage(name, options);
			default:
				console.log("Missing deny message for " + prevInput);
				return { speaker: "Narrator", line: <p>Whoops! Looks like some sort of error occurred... silly me!</p> };
		}
	},
	getFailMessage: function(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
			case constants.EXPECTING_RACE:
				var yes = <font className="confirm">yes</font>;
				var no = <font className="deny">no</font>
				return { speaker: "Wizard", line: <p>I'm sorry, I have no idea what you're trying to say... It's a {yes} or {no} question!</p> };
			default:
				console.log("Missing fail message for " + prevInput);
				return { speaker: "Narrator", line: <p>Whoops! Looks like some sort of error occurred... silly me!</p> };
		}
	},
	getMultiChoiceFailMessage: function(input, options, name) {
		switch (input) {
			case constants.EXPECTING_RACE:
				var optionLines = [];

				var firstLine = true;

				var comma = (options.length > 2) ? "," : "";

				options.forEach(function(option, id) {
					if (!firstLine) {
						var or = (id === options.length-1) ? "or " : "";
						optionLines.push(<font key={id}>{comma} {or}<font className={option}>{option}</font></font>);
					} else {
						firstLine = false;
						optionLines.push(<font className={option} key={id}> {option}</font>);
					}
				}.bind(this));

				return {speaker: "Wizard", line: <p>I'm not sure what that's supposed to mean... The options are {optionLines}.</p> };
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
		return { speaker: "Wizard", line: <p>So what are you {name}? {races}</p> };
	},
	getPlayerYes: function() {
		return { speaker: "Player", line: <p>Yes.</p> };
	},
	getPlayerNo: function() {
		return { speaker: "Player", line: <p>No.</p> };
	},
	getPlayerFail: function() {
		var failLines = [
			<p>*incomprehensible garbling*</p>,
			<p>*clucks like a chicken*</p>
		];
		return { speaker: "Player", line: failLines[Math.floor(Math.random() * failLines.length)] };
	}
};