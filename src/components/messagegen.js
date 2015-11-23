var constants = require("./../constants"),
	React = require("react");

module.exports = {
	getConfirmMessage: function(prevInput, name, option) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: constants.WIZARD, line: <p>Great! Then I'll call you {name} from now on.</p> };
			case constants.EXPECTING_RACE:
				return { speaker: constants.WIZARD, line: <p>Excellent! At least it seems you're sure of something...</p> };
			case constants.EXPECTING_WEAPON:
				return { speaker: constants.WIZARD, line: <p>Fantastic! I'm sure it will serve you well in the trials to come.</p> };
			case constants.EXPECTING_RESET:
				return { speaker: constants.FINAL_BOSS, line: <p>Ah well. Guess I win then?</p> };
			default:
				console.log("Missing confirm message for " + prevInput);
				return { speaker: constants.NARRATOR, line: <p>Whoops! Looks like some sort of error occurred... silly me!</p> };
		}
	},
	getDenyMessage: function(prevInput, name, options) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: constants.WIZARD, line: <p>Alright, how about we try this again. What is your name?</p> };
			case constants.EXPECTING_RACE:
				return this.getRaceMessage(name, options);
			case constants.EXPECTING_WEAPON:
				var lines = this.getMultiOptionLines(options);
				return { speaker: constants.WIZARD, line: <p>Let's try again. Pick something to hit things with. {lines}?</p> };
			case constants.EXPECTING_RESET:
				return { speaker: constants.FINAL_BOSS, line: <p>Well that's a relief! Better get back to what you were doing... I'll just be over here creating an oppressive reign of terror or whatever it is that I do...</p> };
			default:
				console.log("Missing deny message for " + prevInput);
				return { speaker: constants.NARRATOR, line: <p>Whoops! Looks like some sort of error occurred... silly me!</p> };
		}
	},
	getFailMessage: function(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
			case constants.EXPECTING_RACE:
			case constants.EXPECTING_WEAPON:
				var yes = <font className="confirm">yes</font>;
				var no = <font className="deny">no</font>
				return { speaker: constants.WIZARD, line: <p>I'm sorry, I have no idea what you're trying to say... It's a {yes} or {no} question!</p> };
			case constants.EXPECTING_RESET:
				var yes = <font className="confirm">yes</font>;
				var no = <font className="deny">no</font>		
				return { speaker: constants.FINAL_BOSS, line: <p>What on earth is that supposed to mean? All I need is a simple {yes} or {no}!</p> };
			default:
				console.log("Missing fail message for " + prevInput + " confirmation.");
				return { speaker: constants.NARRATOR, line: <p>Whoops! Looks like some sort of error occurred... silly me!</p> };
		}
	},
	getMultiChoiceFailMessage: function(input, options, name) {
		switch (input) {
			case constants.EXPECTING_WEAPON:
			case constants.EXPECTING_RACE:
				var optionLines = this.getMultiOptionLines(options);

				return {speaker: constants.WIZARD, line: <p>I'm not sure what that's supposed to mean... The options are {optionLines}.</p> };
			default:
				console.log("Missing npc fail message for: " + input);
				return { speaker: constants.NARRATOR, line: <p>Whoops! Looks like some sort of error occurred... silly me!</p> };
		}
	},
	getMultiOptionLines: function(options) {
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

		return optionLines;
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
		return { speaker: constants.WIZARD, line: <p>So what are you {name}? {races}</p> };
	},
	getWeaponMessage: function(name, starterWeapons) {
		var weapons = [];

		var firstLoop = true;

		// Loop through all weapons
		for (var weaponName in starterWeapons) {
			var prefix = ("AEIOU".indexOf(weaponName.charAt(0).toUpperCase()) < 0) ? "A" : "An";
			if (!firstLoop) {
				var choices = ["Maybe ", "Or perhaps ", ""];
				var rand = Math.floor(Math.random() * choices.length);
				prefix = (rand === choices.length-1) ? prefix : choices[rand] + prefix.toLowerCase();
				weapons.push(<font key={weaponName}>{prefix} <font className={weaponName}>{weaponName}</font>? </font>);
			} else {
				weapons.push(<font key={weaponName}>How about {prefix.toLowerCase()} <font className={weaponName}>{weaponName}</font>? </font>);
				firstLoop = false;
			}
		}
		return { speaker: constants.WIZARD, line: <p>Hmm... Come to think of it, we can't very well send you out unarmed now, can we? What's your weapon of choice? {weapons}</p> };
	},
	getPlayerYes: function() {
		return { speaker: constants.PLAYER, line: <p>Yes.</p> };
	},
	getPlayerNo: function() {
		return { speaker: constants.PLAYER, line: <p>No.</p> };
	},
	getPlayerFail: function() {
		var failLines = [
			<p>*incomprehensible garbling*</p>,
			<p>*clucks like a chicken*</p>
		];
		return { speaker: constants.PLAYER, line: failLines[Math.floor(Math.random() * failLines.length)] };
	},
	getNoSuchItemMessage: function(itemName) {
		return { speaker: constants.NARRATOR, line: <p>You don't currently possess an item of name <font className="deny">{itemName}</font>!</p> };
	},
	getResetMessage: function(name) {
		return { speaker: constants.FINAL_BOSS, line: <p>Whoa there {name}! Are you absolutely certain you want to throw in the towel and let me have my way with the world? That doesn't sound very fun...</p> };
	}
};