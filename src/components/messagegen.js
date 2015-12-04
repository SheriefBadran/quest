import constants from "./../constants";

module.exports = {
	getConfirmMessage(prevInput, name, option) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: constants.WIZARD, line: [ { className: constants.WIZARD, text: "Great! Then I'll call you " + name + " from now on." } ] };
			case constants.EXPECTING_RACE:
				return { speaker: constants.WIZARD, line: [ { className: constants.WIZARD, text: "Excellent! At least it seems you're sure of something..." } ] };
			case constants.EXPECTING_WEAPON:
				return { speaker: constants.WIZARD, line: [ { className: constants.WIZARD, text: "Fantastic! I'm sure it will serve you well in the trials to come." } ] };
			case constants.EXPECTING_RESET:
				return { speaker: constants.FINAL_BOSS, line: [ { className: constants.FINAL_BOSS, text: "Ah well. Guess I win then?" } ] };
			default:
				console.log("Missing confirm message for " + prevInput);
				return { speaker: constants.NARRATOR, line: [ { className: constants.NARRATOR, text: "Whoops! Looks like some sort of error occurred... silly me!" } ] };
		}
	},
	getDenyMessage(prevInput, name, options) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: constants.WIZARD, line: [ { className: constants.WIZARD, text: "Alright, how about we try this again. What is your name?" } ] };
			case constants.EXPECTING_RACE:
				return this.getRaceMessage(name, options);
			case constants.EXPECTING_WEAPON:
				let optionLines = this.getMultiOptionLines(options);
				let line = [ { className: constants.WIZARD, text: "Let's try again. Pick something to hit things with. " }, { className: constants.WIZARD, text: "?" } ];
				line.splice.apply(line, [1, 0].concat(optionLines));
				return { speaker: constants.WIZARD, line: line };
			case constants.EXPECTING_RESET:
				return { speaker: constants.FINAL_BOSS, line: [ { className: constants.FINAL_BOSS, text: "Well that's a relief! Better get back to what you were doing... I'll just be over here creating an oppressive reign of terror or whatever it is that I do..." } ] };
			default:
				console.log("Missing deny message for " + prevInput);
				return { speaker: constants.NARRATOR, line: [ { className: constants.NARRATOR, text: "Whoops! Looks like some sort of error occurred... silly me!" } ] };
		}
	},
	getFailMessage(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
			case constants.EXPECTING_RACE:
			case constants.EXPECTING_WEAPON:
				return { speaker: constants.WIZARD, line: [ { className: constants.WIZARD, text: "I'm sorry, I have no idea what you're trying to say... It's a " }, { className: "confirm", text: "yes" }, { className: constants.WIZARD, text: " or " }, { className: "deny", text: "no" }, { className: constants.WIZARD, text: " question!" } ] };
			case constants.EXPECTING_RESET:	
				return { speaker: constants.FINAL_BOSS, line: [ { className: constants.FINAL_BOSS, text: "What on earth is that supposed to mean? All I need is a simple " }, { className: "confirm", text: "yes" }, { className: constants.FINAL_BOSS, text: " or " }, { className: "deny", text: "no" }, { className: constants.FINAL_BOSS, text: "!" } ] };
			default:
				console.log("Missing fail message for " + prevInput + " confirmation.");
				return { speaker: constants.NARRATOR, line: [ { className: constants.NARRATOR, text: "Whoops! Looks like some sort of error occurred... silly me!" } ] };
		}
	},
	getMultiChoiceFailMessage(input, options, name) {
		switch (input) {
			case constants.EXPECTING_WEAPON:
			case constants.EXPECTING_RACE:
				let optionLines = this.getMultiOptionLines(options);
				let line = [ { className: constants.WIZARD, text: "I'm not sure what that's supposed to mean... The options are " }, { className: constants.WIZARD, text: "." } ];
				line.splice.apply(line, [1, 0].concat(optionLines));
				return {speaker: constants.WIZARD, line: line };
			default:
				console.log("Missing npc fail message for: " + input);
				return { speaker: constants.NARRATOR, line: [ { className: constants.NARRATOR, text: "Whoops! Looks like some sort of error occurred... silly me!" } ] };
		}
	},
	getMultiOptionLines(options) {
		let optionLines = [];

		let firstLine = true;

		let comma = (options.length > 2) ? "," : "";

		//TODO: Change this to use map somehow
		options.forEach(function(option, id) {
			if (!firstLine) {
				let or = (id === options.length-1) ? "or " : "";
				optionLines.push({ text: comma + " " + or + " " });
				optionLines.push({ className: option, text: option });
			} else {
				firstLine = false;
				optionLines.push({ className: option, text: " " + option });
			}
		}.bind(this));

		return optionLines;
	},
	getRaceMessage(name, classes) {

		let races = [];

		let firstLoop = true;

		// Loop through all races
		for (let raceName in classes) {
			if (classes.hasOwnProperty(raceName)) {
				let race = classes[raceName];
				let prefix = ("AEIOU".indexOf(race.name.charAt(0).toUpperCase()) < 0) ? "A" : "An";
				if (!firstLoop) {
					races.push({ text: prefix + " " });
					races.push({ className: race.name, text: race.name });
					races.push({ text: "? "});
				} else {
					races.push({ text: "Are you " + prefix.toLowerCase() + " "});
					races.push({ className: race.name, text: race.name });
					races.push({ text: "? " });
					firstLoop = false;
				}
			}
		}
		let line = [ { text: "So what are you " + name + "? " } ];
		line.splice.apply(line, [1, 0].concat(races));
		return { speaker: constants.WIZARD, line: line };
	},
	getWeaponMessage(name, starterWeapons) {
		let weapons = [];

		let firstLoop = true;

		// Loop through all weapons
		for (let weaponName in starterWeapons) {
			let prefix = ("AEIOU".indexOf(weaponName.charAt(0).toUpperCase()) < 0) ? "A" : "An";
			if (!firstLoop) {
				let choices = ["Maybe ", "Or perhaps ", ""];
				let rand = Math.floor(Math.random() * choices.length);
				prefix = (rand === choices.length-1) ? prefix : choices[rand] + prefix.toLowerCase();
				weapons.push({ text: prefix + " "});
				weapons.push({ className: weaponName, text: weaponName });
				weapons.push({ text: "? "});
			} else {
				weapons.push({ text: "How about " + prefix.toLowerCase() + " "});
				weapons.push({ className: weaponName, text: weaponName });
				weapons.push({ text: "? "});
				firstLoop = false;
			}
		}
		let line = [ { text: "Hmm... Come to think of it, we can't very well send you out unarmed now, can we? What's your weapon of choice? " } ];
		line.splice.apply(line, [1, 0].concat(weapons));
		return { speaker: constants.WIZARD, line: line };
	},
	getPlayerYes() {
		return { speaker: constants.PLAYER, line: [ { text: "Yes" } ] };
	},
	getPlayerNo() {
		return { speaker: constants.PLAYER, line: [ { text: "No" } ] };
	},
	getPlayerFail() {
		let failLines = [
			"*incomprehensible garbling*",
			"*clucks like a chicken*"
		];
		return { speaker: constants.PLAYER, line: [ { className: constants.PLAYER, text: failLines[Math.floor(Math.random() * failLines.length)] } ] };
	},
	getNoSuchItemMessage(itemName) {
		return { speaker: constants.NARRATOR, line: [ { text: "You don't currently possess an item of name " }, { className: "deny", text: itemName }, { text: "!" } ] };
	},
	getResetMessage(name) {
		return { speaker: constants.FINAL_BOSS, line: [ { text: "Whoa there " + name + "! Are you absolutely certain you want to throw in the towel and let me have my way with the world? That doesn't sound very fun..." } ] };
	},
	getAfterWizardMessage() {
		return { speaker: constants.NARRATOR, line: [ { text: "Stepping forth into the blinding sunlight, you immediately find yourself confronted by a young " }, { className: constants.ELF, text: constants.ELF }, { text: ", suspended upside-down from the branches of a nearby tree." } ] };
	},
	getMapIntroMessage() {
		return { speaker: constants.ELF, line: [ { text: "Oh. You must be the latest vic- uh... hero. " }, { className: constants.PLAYER, text: "Hero" }, { text: ". Right. I don't really want to but I'm supposed to give you this ah uh... " }, { className: "Map", text: "Magic Map" }, { text: ". As long as you draw on it while you walk, you should probably be able to navigate with it!" } ] };
	},
	getMapAddedMessage() {
		return { speaker: constants.NARRATOR, line: [ { text: "A useless blank piece of pa- uh " }, { className: "Map", text: "Magic Map" }, { text: " is forcibly inserted into your inventory!" } ] };
	},
	getMapContMessage() {
		return { speaker: constants.ELF, line: [ { text: "Now remember, this doesn't mean we're friends or anything!" } ] };
	},
	getElfLeaveMessage() {
		return { speaker: constants.NARRATOR, line: [ { text: "The " }, { className: constants.ELF, text: constants.ELF }, { text: " gives you one last glance before pulling herself up into the tree and vanishing from sight, leaving you to wonder why she had ever appeared in the first place. You are now free to roam. Perhaps you should start by looking around?" } ] };
	}
};