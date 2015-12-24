import constants from "./../constants"; //TODO: Allow display to accept strings so that entire with just "text": "stuff" can be string instead.

export default {
	getErrorOccurredMessage() {
		return { speaker: constants.NARRATOR, line: [ "Whoops! Looks like some sort of error occurred... silly me!" ] };
	},
	getNameLengthMessage() {
		return { speaker: constants.WIZARD, line: [ "Hmmm... are you sure about that? Around here, names are usually between " + constants.MIN_NAME_LENGTH + " and " + constants.MAX_NAME_LENGTH + " characters in length! How about trying again?" ] };
	},
	getStateNameMessage(input) {
		return { speaker: constants.PLAYER, line: [ "I'm " + input + "." ] };
	},
	getNameAreYouSureMessage(input) {
		return { speaker: constants.WIZARD, line: [ input + " you say? Weird name... are you sure about that?" ] };
	},
	getConfirmMessage(prevInput, name, option) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: constants.WIZARD, line: [ "Great! Then I'll call you " + name + " from now on." ] };
			case constants.EXPECTING_RACE:
				return { speaker: constants.WIZARD, line: [ "Excellent! At least it seems you're sure of something..." ] };
			case constants.EXPECTING_WEAPON:
				return { speaker: constants.WIZARD, line: [ "Fantastic! I'm sure it will serve you well in the trials to come." ] };
			case constants.EXPECTING_RESET:
				return { speaker: constants.FINAL_BOSS, line: [ "Ah well. Guess I win then?" ] };
			default:
				console.log("Missing confirm message for " + prevInput);
				return this.getErrorOccurredMessage();
		}
	},
	getDenyMessage(prevInput, name, options) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
				return { speaker: constants.WIZARD, line: [ "Alright, how about we try this again. What is your name?" ] };
			case constants.EXPECTING_RACE:
				return this.getRaceMessage(name, options);
			case constants.EXPECTING_WEAPON:
				let optionLines = this.getMultiOptionLines(options);
				let line = [ "Let's try again. Pick something to hit things with. ", "?" ];
				line.splice.apply(line, [1, 0].concat(optionLines));
				return { speaker: constants.WIZARD, line: line };
			case constants.EXPECTING_RESET:
				return { speaker: constants.FINAL_BOSS, line: [ "Well that's a relief! Better get back to what you were doing... I'll just be over here creating an oppressive reign of terror or whatever it is that I do..." ] };
			default:
				console.log("Missing deny message for " + prevInput);
				return this.getErrorOccurredMessage();
		}
	},
	getFailMessage(prevInput, name) {
		switch (prevInput) {
			case constants.EXPECTING_NAME:
			case constants.EXPECTING_RACE:
			case constants.EXPECTING_WEAPON:
				return { speaker: constants.WIZARD, line: [ "I'm sorry, I have no idea what you're trying to say... It's a ", { className: "confirm", text: "yes" }, " or ", { className: "deny", text: "no" }, " question!" ] };
			case constants.EXPECTING_RESET:	
				return { speaker: constants.FINAL_BOSS, line: [ "What on earth is that supposed to mean? All I need is a simple ", { className: "confirm", text: "yes" }, " or ", { className: "deny", text: "no" }, "!" ] };
			default:
				console.log("Missing fail message for " + prevInput + " confirmation.");
				return this.getErrorOccurredMessage();
		}
	},
	getMultiChoiceFailMessage(input, options, name) {
		switch (input) {
			case constants.EXPECTING_WEAPON:
			case constants.EXPECTING_RACE:
				let optionLines = this.getMultiOptionLines(options);
				let line = [ "I'm not sure what that's supposed to mean... The options are ", "." ];
				line.splice.apply(line, [1, 0].concat(optionLines));
				return {speaker: constants.WIZARD, line: line };
			default:
				console.log("Missing npc fail message for: " + input);
				return this.getErrorOccurredMessage();
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
				weapons.push(prefix + " ");
				weapons.push({ className: weaponName, text: weaponName });
				weapons.push("? ");
			} else {
				weapons.push("How about " + prefix.toLowerCase() + " ");
				weapons.push({ className: weaponName, text: weaponName });
				weapons.push("? ");
				firstLoop = false;
			}
		}
		let line = [ "Hmm... Come to think of it, we can't very well send you out unarmed now, can we? What's your weapon of choice? " ];
		line.splice.apply(line, [1, 0].concat(weapons));
		return { speaker: constants.WIZARD, line: line };
	},
	getPlayerYes() {
		return { speaker: constants.PLAYER, line: [ "Yes" ] };
	},
	getPlayerNo() {
		return { speaker: constants.PLAYER, line: [ "No" ] };
	},
	getPlayerFail() {
		let failLines = [
			"*incomprehensible garbling*",
			"*clucks like a chicken*"
		];
		return { speaker: constants.PLAYER, line: [ failLines[Math.floor(Math.random() * failLines.length)] ] };
	},
	getPlayerBattleFailMessage() {
		let failLines = [
			"You fall flat on your face."
		];
		return { speaker: constants.NARRATOR, line: [ failLines[Math.floor(Math.random() * failLines.length)] ] };
	},
	getNoSuchItemMessage(itemName) {
		return { speaker: constants.NARRATOR, line: [ "You don't currently possess an item of name ", { className: "deny", text: itemName }, "!" ] };
	},
	getResetMessage(name) {
		return { speaker: constants.FINAL_BOSS, line: [ "Whoa there " + name + "! Are you absolutely certain you want to throw in the towel and let me have my way with the world? That doesn't sound very fun..." ] };
	},
	getAfterWizardMessage() {
		return { speaker: constants.NARRATOR, line: [ "Stepping forth into the blinding sunlight, you immediately find yourself confronted by a young ", { className: constants.ELF, text: constants.ELF }, ", suspended upside-down from the branches of a nearby tree." ] };
	},
	getMapIntroMessage() {
		return { speaker: constants.ELF, line: [ "Oh. You must be the latest vic- uh... hero. ", { className: constants.PLAYER, text: "Hero" }, ". Right. I don't really want to but I'm supposed to give you this ah uh... ", { className: "Map", text: "Magic Map" }, ". As long as you draw on it while you walk, you should probably be able to navigate with it!" ] };
	},
	getMapAddedMessage() {
		return { speaker: constants.NARRATOR, line: [ "A useless blank piece of pa- uh ", { className: "Map", text: "Magic Map" }, " is forcibly inserted into your inventory!" ] };
	},
	getMapContMessage() {
		return { speaker: constants.ELF, line: [ "Now remember, this doesn't mean we're friends or anything!" ] };
	},
	getElfLeaveMessage() {
		return { speaker: constants.NARRATOR, line: [ "The ", { className: constants.ELF, text: constants.ELF }, " gives you one last glance before pulling herself up into the tree and vanishing from sight, leaving you to wonder why she had ever appeared in the first place. You are now free to roam. Perhaps you should start by looking around?" ] };
	},
	getEquipMessage(requestedItem) {
		return { speaker: constants.NARRATOR, line: [ "You equip the " + requestedItem.prefix + " ", { className: requestedItem.name, text: requestedItem.name }, "." ] };
	},
	getCannotBeEquippedMessage(requestedItem) {
		return { speaker: constants.NARRATOR, line: [ { className: requestedItem.name, text: requestedItem.name }, " cannot be equipped!" ] };
	},
	getLookAtItemMessage(requestedItem) {
		let prefix = ("AEIOU".indexOf(requestedItem.prefix.charAt(0).toUpperCase()) < 0) ? "A" : "An";
		return { speaker: constants.NARRATOR, line: [ prefix + " " + requestedItem.prefix + " ", { className: requestedItem.name, text: requestedItem.name }, ". ", ...requestedItem.description ] };
	},
	getItemStatsMessage(requestedItem) {
		return { speaker: constants.NARRATOR, line: [ "The stats are Strength: " + requestedItem.stats.str + ", Magic: " + requestedItem.stats.mag + ", Dexterity: " + requestedItem.stats.dex + ", and Defence: " + requestedItem.stats.def + "." ] };
	},
	getLookAroundMessage(playerPos, map) {
		// TODO: make it look around the tile you're currently in too

		// We need to check what's in the four cardinal directions
		let message = "";

		// Make sure it's both on the map 
		if (playerPos.y -1 >= 0 ) {
			message += "To the north you see ";
			message += (map[playerPos.y - 1][playerPos.x].description || map[playerPos.y - 1][playerPos.x].type) + ". ";
		}
		
		if (playerPos.x + 1 < map[0].length) {
			message += "To the east you see ";
			message += (map[playerPos.y][playerPos.x + 1].description || map[playerPos.y][playerPos.x + 1].type) + ". ";
		}
		
		if (playerPos.y + 1 < map.length) {
			message += "To the south you see ";
			message += (map[playerPos.y + 1][playerPos.x].description || map[playerPos.y + 1][playerPos.x].type) + ". ";
		}

		if (playerPos.x -1 >= 0 ) {
			message += "To the west you see ";
			message += (map[playerPos.y][playerPos.x - 1].description || map[playerPos.y][playerPos.x - 1].type) + ". ";
		}

		return { speaker: constants.NARRATOR, line: [ message ] };
	},
	getEncounterMessage(NPC) {
		return { speaker: constants.NARRATOR, line: NPC.description };
	},
	getPlayerRaceChoiceMessage(requestedRace) {
		let prefix = ("AEIOU".indexOf(requestedRace.name.charAt(0).toUpperCase()) < 0) ? "A" : "An";
		return { speaker: constants.PLAYER, line: [ "I'm " + prefix.toLowerCase() + " " + requestedRace.name + "... I think?" ] };
	},
	getRaceAreYouSureMessage(requestedRace) {
		let prefix = ("AEIOU".indexOf(requestedRace.name.charAt(0).toUpperCase()) < 0) ? "A" : "An";
		return { speaker: constants.WIZARD, line: [ "Aha! " + prefix + " ", { className: requestedRace.name, text: requestedRace.name }, " eh? ", ...requestedRace.description, " Are you sure about this?" ] }
	},
	getPlayerWeaponSelectMessage(chosenWeapon) {
		return { speaker: constants.PLAYER, line: [ "I think I'll take the " + chosenWeapon.name + "." ] };
	},
	getConfirmWeaponMessage(chosenWeapon) {
		return { speaker: constants.WIZARD, line: [ "A fine choice! ", ...chosenWeapon.description, " Is this what you really want?" ] };
	},
	getStatusUpdatedMessage() {
		return { speaker: constants.NARRATOR, line: [ "Your status has been updated!" ] };
	},
	getItemAddedMessage(item) {
		let prefix = ("AEIOU".indexOf(item.name.charAt(0).toUpperCase()) < 0) ? "A" : "An";
		let has = (item.isPlural) ? "have" : "has";
		return { speaker: constants.NARRATOR, line: [ prefix + " " + item.prefix + " ", { className: item.name, text: item.name }, " " + has + " been added to your inventory!" ] };
	},
	getDontForgetToEquipMessage(item) {
		return { speaker: constants.WIZARD, line: [ "Don't forget to equip it before you head out into the world by using ", { className: "confirm", text: "equip " + item.name }, "! Not my fault if you end up running around unarmed!" ] };
	},
	getISeeYouHaveQuestionsMessage() {
		return { speaker: constants.WIZARD, line: [ "Ah, I can see from the look on your face that you have questions. Out with it then!" ] };
	},
	getWrongWayMessage() {
		return { speaker: constants.NARRATOR, line: [ "You can't go that way!" ] };
	},
	getMoveNorthMessage() {
		return { speaker: constants.NARRATOR, line: [ "You move north." ] };
	},
	getMoveEastMessage() {
		return { speaker: constants.NARRATOR, line: [ "You move east." ] };
	},
	getMoveSouthMessage() {
		return { speaker: constants.NARRATOR, line: [ "You move south." ] };
	},
	getMoveWestMessage() {
		return { speaker: constants.NARRATOR, line: [ "You move west." ] };
	},
	getPlayerWantResetMessage() {
		return { speaker: constants.PLAYER, line: [ "I can't take this anymore..." ] };
	},
	getEncounterTalkMessage(NPC) {
		return { speaker: constants.NARRATOR, line: [ "You attempt to strike up a conversation with the ", { className: NPC.name, text: NPC.name }, "." ] };
	},
	getEncounterRandomTalkMessage(NPC) {
		let randomResponse = NPC.talk[Math.floor(Math.random() * NPC.talk.length)];
		return { speaker: NPC.name, line: randomResponse };
	},
	getEncounterAttackMessage(NPC, damage) {
		let attackLines = [ //TODO: Vary these by player level to give illusion of improvement
			"You launch a fierce attack on the ",
			"You flail wildy in the direction of the "
		];
		return { speaker: constants.NARRATOR, line: [ attackLines[Math.floor(Math.random() * attackLines.length)], { className: NPC.name, text: NPC.name }, ", dealing " , { className: "deny", text: damage + " damage" }, "." ] };
	},
	getEncounterEnemyAttackDamageMessage(NPC) {
		let randomResponse = NPC.attackAction[Math.floor(Math.random() * NPC.attackAction.length)];
		return { speaker: constants.NARRATOR, line: randomResponse };
	},
	getPlayerMissMessage() {
		let attackLines = [ //TODO: Vary these by player level to give illusion of improvement
			"You stumble over your own feet and fail to hit your target."
		];
		return { speaker: constants.NARRATOR, line: [ attackLines[Math.floor(Math.random() * attackLines.length)] ] };
	},
	getEncounterMissMessage(NPC) {
		let randomResponse = NPC.miss[Math.floor(Math.random() * NPC.miss.length)];
		return { speaker: constants.NARRATOR, line: randomResponse };
	},
	getPlayerDamageTakenMessage(damage) {
		return { speaker: constants.NARRATOR, line: [ "You take ", { className: "deny", text: damage + " damage" },  "." ] };
	},
	getEncounterDamageTakenMessage(NPC) {
		let randomResponse = NPC.attacked[Math.floor(Math.random() * NPC.attacked.length)];
		return { speaker: NPC.name, line: randomResponse };
	},
	getEncounterObserveMessage(encounter) {
		return { speaker: constants.NARRATOR, line: [ "HP: " + encounter.hp ] }; //TODO: Include other stats
	},
	getEncounterWinMessage(NPC) {
		let randomResponse = NPC.defeated[Math.floor(Math.random() * NPC.defeated.length)];
		return { speaker: constants.NARRATOR, line: randomResponse };
	},
	getPlayerDieMessage() {
		let dieLines = [
			"The mortal blow drives you to your knees. You can feel that the end is near."
		];
		return { speaker: constants.NARRATOR, line: [ dieLines[Math.floor(Math.random() * dieLines.length)] ] };
	},
	getGameOverMessage() {
		return { speaker: constants.FINAL_BOSS, line: [ "Oh dear, I guess this is Game Over then? Better luck next time!" ] };
	},
	getOffWithYouMessage() {
		return { speaker: constants.WIZARD, line: [ "Oh, that's a pity... Well off with you then! Time to save the world or something!" ] };
	},
	getLeaveTowerMessage() {
		return { speaker: constants.NARRATOR, line: [ "With a strength belying his frail physique, the " , { className: constants.WIZARD, text: constants.WIZARD }, " thrusts you from his crumbling tower and out into the unknown world..." ] };
	}
};