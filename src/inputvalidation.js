// Used by playerbar.js for input validation and mapping to action dispatch

import constants from "./constants";
import actions from "./actions";
import messageGen from "./components/messagegen";
import Classes from "./data/class";
import Weapons from "./data/weapon";
import Items from "./data/item";
import MapGen from "./components/mapgen";
import NPCs from "./data/npc";

function checkAndSetName(input) {
	// Validate the length of the name
	if (input.length > constants.MAX_NAME_LENGTH || input.length < constants.MIN_NAME_LENGTH) {
		let message = { speaker: constants.WIZARD, line: [ { text: "Hmmm... are you sure about that? Around here, names are usually between " + constants.MIN_NAME_LENGTH + " and " + constants.MAX_NAME_LENGTH + " characters in length! How about trying again?" } ] };
		return (dispatch)=> {
			dispatch(actions.showMessage({ speaker: constants.PLAYER, line: [ { text: "I'm " + input + "." } ] }, 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	} else {
		let message = { speaker: constants.WIZARD, line: [ { text: input + " you say? Weird name... are you sure about that?" } ] };
		return (dispatch)=> {
			dispatch(actions.setName(input));
			dispatch(actions.setInputExpected(constants.EXPECTING_CONF));
			dispatch(actions.showMessage({ speaker: constants.PLAYER, line: [ { text: "I'm " + input + "." } ] }, 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	}
};

function getRequestedItem(itemName, inventory) {
	let requestedItem = null;
	inventory.forEach(function(item) {
		if (item.name.toUpperCase() === itemName.toUpperCase()) {
			requestedItem = item;
		}
	}.bind(this));
	return requestedItem;
};

function attemptEquip(input, inventory) {
	input = input.split(" ");

	if (input.length > 1) {

		let itemName = input[1];
		for (let i = 2; i < input.length; ++i) {
			itemName += " " + input[i];
		}

		let requestedItem = getRequestedItem(itemName, inventory);

		if (requestedItem) {
			if (requestedItem.equippable) {
				return (dispatch)=> {
					dispatch(actions.equipItem(requestedItem));
					dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You equip the " + requestedItem.prefix + " " }, { className: requestedItem.name, text: requestedItem.name }, { text: "." } ] }, 0));
				};
			} else {
				return (dispatch)=> {
					dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { className: requestedItem.name, text: requestedItem.name }, { text: " cannot be equipped!" } ] }, 0));
				};
			}
		} else {
			return (dispatch)=> {
				dispatch(actions.showMessage(messageGen.getNoSuchItemMessage(itemName), 0));
			};
		}
	}
};

function attemptLookAt(input, inventory) {
	input = input.split(" ");

	if (input.length > 2) {
		let itemName = input[2];
		for (let i = 3; i < input.length; ++i) {
			itemName += " " + input[i];
		}

		let requestedItem = getRequestedItem(itemName, inventory);

		if (requestedItem) {
			let prefix = ("AEIOU".indexOf(requestedItem.prefix.charAt(0).toUpperCase()) < 0) ? "A" : "An";
			return (dispatch)=> {
				dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: prefix + " " + requestedItem.prefix + " " }, { className: requestedItem.name, text: requestedItem.name }, { text: ". " + requestedItem.description } ] }, 0));
				if (requestedItem.type === constants.WEAPON || requestedItem.type === constants.ARMOUR) {
					dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: "The stats are Strength: " + requestedItem.stats.str + ", Magic: " + requestedItem.stats.mag + ", Dexterity: " + requestedItem.stats.dex + ", and Defence: " + requestedItem.stats.def + "." } ] }, 0));
				}
			};
		} else {
			return (dispatch)=> {
				dispatch(actions.showMessage(messageGen.getNoSuchItemMessage(itemName), 0));
			}
		}
	}
};

function lookAround(playerPos, map) {
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

	return (dispatch)=> {
		if (map[playerPos.y][playerPos.x].encounter) {
			let encounter = NPCs.all[map[playerPos.y][playerPos.x].encounter];
			dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: encounter.description }, 0));
		}

		dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: message } ] }, 0));
	};
};

function checkAndSelectRace(input, expectedInput, name) {
	let raceOptions = [];

	for (let raceName in Classes) {
		if (Classes.hasOwnProperty(raceName)) {
			raceOptions.push(raceName);
		}
	}

	// Check if it's a valid race
	let valid = false;
	let chosenRace;
	for (let i = 0; i < raceOptions.length; ++i) {
		if (input.toUpperCase().indexOf(raceOptions[i].toUpperCase()) > -1) { // Check if it's mentioned anywhere in the input
			valid = true;
			chosenRace = raceOptions[i];
			break;
		}
	}

	if (valid) {
		let prefix = ("AEIOU".indexOf(input.charAt(0).toUpperCase()) < 0) ? "A" : "An";
		let playerMessage = { speaker: constants.PLAYER, line: [ { text: "I'm " + prefix.toLowerCase() + " " + chosenRace + "... I think?" } ] };
		let message = { speaker: constants.WIZARD, line: [ { text: "Aha! " + prefix + " " }, { className: chosenRace, text: chosenRace }, { text: " eh? " + Classes[chosenRace].description + " Are you sure about this?" } ] };
		return (dispatch)=> {
			dispatch(actions.setStats(Classes[chosenRace].stats));
			dispatch(actions.setInputExpected(constants.EXPECTING_CONF));
			dispatch(actions.showMessage(playerMessage, 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	} else { // If it's not a valid race then we do a fail again
		let playerMessage = messageGen.getPlayerFail();
		let message = messageGen.getMultiChoiceFailMessage(expectedInput, raceOptions, name);
		return (dispatch)=> {
			dispatch(actions.showMessage(playerMessage, 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	}
};

function checkAndSelectStarterWeapon(input, expectedInput, name, inventory) {
	let weaponOptions = [];

	for (let weaponName in Weapons.starter) {
		if (Weapons.starter.hasOwnProperty(weaponName)) {
			weaponOptions.push(weaponName);
		}
	}

	// Check validity
	let valid = false;
	let chosenWeapon; // An object

	for (let i = 0; i < weaponOptions.length; ++i) {
		if (input.toUpperCase().indexOf(weaponOptions[i].toUpperCase()) > -1) { // Check if it's mentioned anywhere in the input
			valid = true;
			chosenWeapon = Weapons.starter[weaponOptions[i]];
			break;
		}
	}

	if (valid) {
		let playerMessage = { speaker: constants.PLAYER, line: [ { text: "I think I'll take the " + chosenWeapon.name + "." } ] };
		let message = { speaker: constants.WIZARD, line: [ { text: "A fine choice! " + chosenWeapon.description + " Is this what you really want?" } ] };
		return (dispatch)=> {
			if (inventory.length > 0) { // Remove the item if it was added in a previous cycle
				dispatch(actions.removeItem(inventory[inventory.length-1]));
			}
			dispatch(actions.addItem(chosenWeapon, 0));
			dispatch(actions.setInputExpected(constants.EXPECTING_CONF));
			dispatch(actions.showMessage(playerMessage, 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	} else {
		let playerMessage = messageGen.getPlayerFail();
		let message = messageGen.getMultiChoiceFailMessage(expectedInput, weaponOptions, name);
		return (dispatch)=> {
			dispatch(actions.showMessage(playerMessage, 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	}
};

function checkAndValidateConfirmation(input, prevInput, name, inventory) {
	let playerMessage;
	let message;
	if (input.toUpperCase() === "YES" || input.toUpperCase() === "Y") {
		playerMessage = messageGen.getPlayerYes();
		message = messageGen.getConfirmMessage(prevInput, name);
		return (dispatch)=> {
			dispatch(actions.showMessage(playerMessage, 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
			switch (prevInput) {
				case constants.EXPECTING_NAME:
					dispatch(actions.showMessage(messageGen.getRaceMessage(name, Classes), 2000));
					dispatch(actions.setInputExpected(constants.EXPECTING_RACE));
					break;
				case constants.EXPECTING_RACE:
					dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: "Your status has been updated!" } ] }, 2000));
					dispatch(actions.setDisplayStats(true, 2000));
					dispatch(actions.showMessage(messageGen.getWeaponMessage(name, Weapons.starter), 3000));
					dispatch(actions.setInputExpected(constants.EXPECTING_WEAPON));
					break;
				case constants.EXPECTING_WEAPON:
					let latestItem = inventory[inventory.length-1];
					let prefix = ("AEIOU".indexOf(latestItem.name.charAt(0).toUpperCase()) < 0) ? "A" : "An";
					let has = (latestItem.isPlural) ? "have" : "has";
					dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: prefix + " " + latestItem.prefix + " " }, { className: latestItem.name, text: latestItem.name }, { text: " " + has + " been added to your inventory!" } ] }, 2000));
					dispatch(actions.setDisplayInventory(true, 2000));
					dispatch(actions.showMessage({ speaker: constants.WIZARD, line: [ { text: "Don't forget to equip it before you head out into the world by using " }, { className: "confirm", text: "equip " + latestItem.name }, { text: "! Not my fault if you end up running around unarmed!" } ] }, 3000));
					dispatch(actions.showMessage({ speaker: constants.WIZARD, line: [ { text: "Ah, I can see from the look on your face that you have questions. Out with it then!" } ] }, 4000));
					dispatch(actions.setInputExpected(constants.EXPECTING_ANYTHING));
					break;
				case constants.EXPECTING_RESET:
					dispatch(actions.resetGame(5000));
					break;
				default:
					dispatch(actions.setInputExpected(constants.DISABLED));
					throw new Error("Missing case for confirmation.");
			}
		};
	} else if (input.toUpperCase() === "NO" || input.toUpperCase() === "N") {
		let options = [];

		if (prevInput === constants.EXPECTING_RACE) {
			options = Classes;
		} else if (prevInput === constants.EXPECTING_WEAPON) {
			for (let weaponName in Weapons.starter) {
				if (Weapons.starter.hasOwnProperty(weaponName)) {
					options.push(weaponName);
				}
			}
		}

		playerMessage = messageGen.getPlayerNo();
		message = messageGen.getDenyMessage(prevInput, name, options);
		return (dispatch)=> {
			dispatch(actions.setInputExpected(prevInput));
			dispatch(actions.showMessage(playerMessage, 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	} else {
		playerMessage = messageGen.getPlayerFail();
		message = messageGen.getFailMessage(prevInput, name);
		return (dispatch)=> {
			dispatch(actions.showMessage(playerMessage, 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	}
};

function checkAndMovePlayer(input, playerPos, map) { //TODO: Possibly remove the text saying which direction you moved
	let wrongWay = { speaker: constants.NARRATOR, line: [ { text: "You can't go that way!" } ] };

	let movement = { x: 0, y: 0 };

	return (dispatch)=> {
		if (input.toUpperCase() === "N" || input.toUpperCase().indexOf("NORTH") > -1) {
			// Make sure it's both on the map and that it's not an obstacle
			if (playerPos.y -1 < 0 || map[playerPos.y - 1][playerPos.x].obstacle) {
				dispatch(actions.showMessage(wrongWay, 0));
			} else {
				movement = { x: 0, y: -1 };
				dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You move north." } ] }, 0));
			}
		} else if (input.toUpperCase() === "E" || input.toUpperCase().indexOf("EAST") > -1) {
			if (playerPos.x + 1 > map[0].length - 1 || map[playerPos.y][playerPos.x + 1].obstacle) {
				dispatch(actions.showMessage(wrongWay, 0));
			} else {
				movement = { x: 1, y: 0 };
				dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You move east." } ] }, 0));
			}
		} else if (input.toUpperCase() === "S" || input.toUpperCase().indexOf("SOUTH") > -1) {
			if (playerPos.y + 1 > map.length - 1 || map[playerPos.y + 1][playerPos.x].obstacle) {
				dispatch(actions.showMessage(wrongWay, 0));
			} else {
				movement = { x: 0, y: 1 };
				dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You move south." } ] }, 0));
			}
		} else if (input.toUpperCase() === "W" || input.toUpperCase().indexOf("WEST") > -1) {
			if (playerPos.x -1 < 0 || map[playerPos.y][playerPos.x - 1].obstacle) {
				dispatch(actions.showMessage(wrongWay, 0));
			} else {
				movement = { x: -1, y: 0 };
				dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You move west." } ] }, 0));
			}
		}

		if (movement.x !== 0 || movement.y !== 0 ) {
			dispatch(actions.movePlayer(movement));

			if (map[playerPos.y + movement.y][playerPos.x + movement.x].encounter) {
				let encounter = NPCs.all[map[playerPos.y + movement.y][playerPos.x + movement.x].encounter];
				dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: encounter.description }, 0));
				encounter.seen = true;
			}
		}
	};

	// TODO: things like description when entering special new area
};

export default (input, expectedInput, prevInput, name, playerPos, inventory, map)=> { //TODO: Break stuff up!
	if (input.split(" ")[0].toUpperCase() === "RESET") { // If they want to give up and reset the game
		return (dispatch)=> {
			dispatch(actions.showMessage({ speaker: constants.PLAYER, line: [ { text: "I can't take this anymore..." } ] }, 0));
			dispatch(actions.showMessage(messageGen.getResetMessage(name), 1000));
			dispatch(actions.setInputExpected(constants.EXPECTING_RESET));
			dispatch(actions.setInputExpected(constants.EXPECTING_CONF));
		};
	} else if (input.split(" ")[0].toUpperCase() === "EQUIP" && inventory.length > 0) {	// If they're looking to equip and have an inventory
		return (dispatch)=> {
			dispatch(attemptEquip(input, inventory));
		};
	} else if (input.toUpperCase().indexOf("LOOK AT") > -1 && inventory.length > 0) { // If they want to look at an item and have an inventory
		return (dispatch)=> {
			dispatch(attemptLookAt(input, inventory));
		};
	} else if (input.toUpperCase().indexOf("LOOK AROUND") > -1 && expectedInput === constants.EXPECTING_MOVEMENT) { // If they want to look around
		return (dispatch)=> {
			dispatch(lookAround(playerPos, map));
		};
	} else if (map[0].length > 0 && map[playerPos.y][playerPos.x].encounter) {
		let encounter = NPCs.all[map[playerPos.y][playerPos.x].encounter];
		if (input.toUpperCase().indexOf("TALK") > -1) {
			let randomResponse = encounter.talk[Math.floor(Math.random() * encounter.talk.length)];
			return (dispatch)=> {
				dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You attempt to strike up a conversation with the " }, { className: encounter.name, text: encounter.name }, { text: "." } ] }, 0));
				dispatch(actions.showMessage({ speaker: encounter.name, line: randomResponse }, 1000));
			};
		}


		//TODO: Encounter stuff!
	}
	switch (expectedInput) {
		case constants.DISABLED:
			throw new Error("Attempted to send input when input was disabled.");
		case constants.EXPECTING_NAME:
			return (dispatch)=> {
				dispatch(checkAndSetName(input));
			};
		case constants.EXPECTING_RACE:
			return (dispatch)=> {
				dispatch(checkAndSelectRace(input, expectedInput, name));
			};
		case constants.EXPECTING_WEAPON:
			return (dispatch)=> {
				dispatch(checkAndSelectStarterWeapon(input, expectedInput, name, inventory));
			};
		case constants.EXPECTING_ANYTHING: // Making fun of the player at the end of the Wizard's intro
			let map = MapGen.generateMap();
			return (dispatch)=> {
				dispatch(actions.showMessage(messageGen.getPlayerFail(), 0));
				dispatch(actions.showMessage({ speaker: constants.WIZARD, line: [ { text: "Oh, that's a pity... Well off with you then! Time to save the world or something!" } ] }, 1000));
				dispatch(actions.showMessage({ speaker: constants.NARRATOR, line: [ { text: "With a strength belying his frail physique, the " }, { className: constants.WIZARD, text: constants.WIZARD }, { text: " thrusts you from his crumbling tower and out into the unknown world..." } ] }, 2000));
				dispatch(actions.showMessage(messageGen.getAfterWizardMessage(), 4000));
				dispatch(actions.showMessage(messageGen.getMapIntroMessage(), 6000));
				dispatch(actions.showMessage(messageGen.getMapAddedMessage(), 8000));
				dispatch(actions.addItem(Items.map, 8000));
				dispatch(actions.addMap(map.map, map.start, 8000));
				dispatch(actions.showMessage(messageGen.getMapContMessage(), 9000));
				dispatch(actions.showMessage(messageGen.getElfLeaveMessage(), 11000));
				dispatch(actions.setInputExpected(constants.EXPECTING_MOVEMENT));
			};
		case constants.EXPECTING_CONF:
			return (dispatch)=> {
				dispatch(checkAndValidateConfirmation(input, prevInput, name, inventory));
			};
		case constants.EXPECTING_MOVEMENT:
			return (dispatch)=> {
				dispatch(checkAndMovePlayer(input, playerPos, map));
			};
		default:
			throw new Error("Missing input case for " + input);
	}
};