// Used by playerbar.js for input validation and mapping to action dispatch

import constants from "./constants";
import actions from "./actions";
import messageGen from "./components/messagegen";
import Classes from "./data/class";
import Weapons from "./data/weapon";
import Items from "./data/item";
import MapGen from "./components/mapgen";
import NPCs from "./data/npc";
import algorithms from "./algorithms";
import {readInputAndGetRequestedItemFrom} from "./utils/inputValidationHelpers";
import _ from "lodash";
import R from "ramda";

function checkAndSetName(input) {
	// Validate the length of the name
	if (input.length > constants.MAX_NAME_LENGTH || input.length < constants.MIN_NAME_LENGTH) {
		let message = messageGen.getNameLengthMessage();
		return (dispatch)=> {
			dispatch(actions.showMessage(messageGen.getStateNameMessage(input), 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	} else {
		let message = messageGen.getNameAreYouSureMessage(input);
		return (dispatch)=> {
			dispatch(actions.setName(input));
			dispatch(actions.setInputExpected(constants.EXPECTING_CONF));
			dispatch(actions.showMessage(messageGen.getStateNameMessage(input), 0));
			dispatch(actions.showMessage(message, 1000)); // Display the message
		};
	}
};

const getRequestedItem = (itemName, inventory) => {
	return inventory.find(item => item.name.toUpperCase() === itemName.toUpperCase());
};

function attemptEquip(input, inventory) {
	if (input.split(' ').length > 1) {
		const getRequestedItem = readInputAndGetRequestedItemFrom(inventory, actions, messageGen);
		const dispatchable = getRequestedItem(input);
		return dispatchable;
	}
	return (dispatch) => {};
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
			return (dispatch)=> {
				dispatch(actions.showMessage(messageGen.getLookAtItemMessage(requestedItem), 0));
				if (requestedItem.equippable) {
					dispatch(actions.showMessage(messageGen.getItemStatsMessage(requestedItem), 0));
				}
			};
		} else {
			return (dispatch)=> {
				dispatch(actions.showMessage(messageGen.getNoSuchItemMessage(itemName), 0));
			}
		}
	}
	return (dispatch)=> {};
};

function lookAround(playerPos, map) {
	return (dispatch)=> {
		if (map[playerPos.y][playerPos.x].encounter) {
			let encounter = NPCs.all[map[playerPos.y][playerPos.x].encounter.id];
			dispatch(actions.showMessage(messageGen.getEncounterMessage(encounter), 0));
		}

		dispatch(actions.showMessage(messageGen.getLookAroundMessage(playerPos, map), 0));
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
	let requestedRace;
	for (let i = 0; i < raceOptions.length; ++i) {
		if (input.toUpperCase().indexOf(raceOptions[i].toUpperCase()) > -1) { // Check if it's mentioned anywhere in the input
			valid = true;
			requestedRace = Classes[raceOptions[i]];
			break;
		}
	}

	if (valid) {
		let playerMessage = messageGen.getPlayerRaceChoiceMessage(requestedRace);
		let message = messageGen.getRaceAreYouSureMessage(requestedRace);
		return (dispatch)=> {
			dispatch(actions.setStats(requestedRace.stats));
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
		let playerMessage = messageGen.getPlayerWeaponSelectMessage(chosenWeapon);
		let message = messageGen.getConfirmWeaponMessage(chosenWeapon);
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
					dispatch(actions.showMessage(messageGen.getStatusUpdatedMessage(), 2000));
					dispatch(actions.setDisplayStats(true, 2000));
					dispatch(actions.showMessage(messageGen.getWeaponMessage(name, Weapons.starter), 3000));
					dispatch(actions.setInputExpected(constants.EXPECTING_WEAPON));
					break;
				case constants.EXPECTING_WEAPON:
					let latestItem = inventory[inventory.length-1];
					dispatch(actions.showMessage(messageGen.getItemAddedMessage(latestItem), 2000));
					dispatch(actions.setDisplayInventory(true, 2000));
					dispatch(actions.showMessage(messageGen.getDontForgetToEquipMessage(latestItem), 3000));
					dispatch(actions.showMessage(messageGen.getISeeYouHaveQuestionsMessage(), 4000));
					dispatch(actions.setInputExpected(constants.EXPECTING_ANYTHING));
					break;
				case constants.EXPECTING_RESET:
					dispatch(actions.setInputExpected(constants.DISABLED));
					dispatch(actions.resetGame(5000));
					break;
				default:
					dispatch(actions.setInputExpected(constants.DISABLED));
					console.log("Missing case for confirmation.");
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

function checkAndMovePlayer(input, playerPos, map, stats, weapon, armour) { //TODO: Possibly remove the text saying which direction you moved
	let wrongWay = messageGen.getWrongWayMessage();

	let movement = { x: 0, y: 0 };

	return (dispatch)=> {
		if (input.toUpperCase() === "N" || input.toUpperCase().indexOf("NORTH") > -1) {
			// Make sure it's both on the map and that it's not an obstacle
			if (playerPos.y -1 < 0 || map[playerPos.y - 1][playerPos.x].obstacle) {
				dispatch(actions.showMessage(wrongWay, 0));
			} else {
				movement = { x: 0, y: -1 };
				dispatch(actions.showMessage(messageGen.getMoveNorthMessage(), 0));
			}
		} else if (input.toUpperCase() === "E" || input.toUpperCase().indexOf("EAST") > -1) {
			if (playerPos.x + 1 > map[0].length - 1 || map[playerPos.y][playerPos.x + 1].obstacle) {
				dispatch(actions.showMessage(wrongWay, 0));
			} else {
				movement = { x: 1, y: 0 };
				dispatch(actions.showMessage(messageGen.getMoveEastMessage(), 0));
			}
		} else if (input.toUpperCase() === "S" || input.toUpperCase().indexOf("SOUTH") > -1) {
			if (playerPos.y + 1 > map.length - 1 || map[playerPos.y + 1][playerPos.x].obstacle) {
				dispatch(actions.showMessage(wrongWay, 0));
			} else {
				movement = { x: 0, y: 1 };
				dispatch(actions.showMessage(messageGen.getMoveSouthMessage(), 0));
			}
		} else if (input.toUpperCase() === "W" || input.toUpperCase().indexOf("WEST") > -1) {
			if (playerPos.x -1 < 0 || map[playerPos.y][playerPos.x - 1].obstacle) {
				dispatch(actions.showMessage(wrongWay, 0));
			} else {
				movement = { x: -1, y: 0 };
				dispatch(actions.showMessage(messageGen.getMoveWestMessage(), 0));
			}
		}

		if (movement.x !== 0 || movement.y !== 0 ) {
			dispatch(actions.movePlayer(movement));

			//TODO: Randomly spawn encounters on a tile if there isn't already an encounter

			if (map[playerPos.y + movement.y][playerPos.x + movement.x].encounter) {
				let NPC = NPCs.all[map[playerPos.y + movement.y][playerPos.x + movement.x].encounter.id];
				dispatch(actions.showMessage(messageGen.getEncounterMessage(NPC), 0));
				if (NPC.hostile) {
					dispatch(actions.setInputExpected(constants.EXPECTING_BATTLE));
					dispatch(doEnemyAttack(NPC, stats, weapon, armour));
				}
			}
		}
	};

	//TODO: things like description when entering special new area
};

function doEnemyAttack(NPC, stats, weapon, armour) {
	let augmentedStats = Object.assign({}, stats);
	augmentedStats = _.reduce(augmentedStats, (ret, data, id)=> {
		if (armour) {
			if (armour.stats[id] > 0) {
				ret[id] += armour.stats[id];
			}
		}
		if (weapon) {
			if (weapon.stats[id] > 0) {
				ret[id] += weapon.stats[id];
			}
		}
		return ret;
	}, augmentedStats);
	let damage = algorithms.calculatePhysicalDamage(NPC.stats, augmentedStats);
	let playerKilled = (stats.currenthp - damage) <= 0;
	return (dispatch)=> {
		if (damage >= 0) {
			dispatch(actions.showMessage(messageGen.getEncounterEnemyAttackDamageMessage(NPC), 1000));
			dispatch(actions.showMessage(messageGen.getPlayerDamageTakenMessage(damage), 1000));
			dispatch(actions.damagePlayer(damage, 1000));
			if (playerKilled) {
				dispatch(actions.setInputExpected(constants.DISABLED));
				dispatch(actions.showMessage(messageGen.getPlayerDieMessage(), 2000));
				dispatch(actions.showMessage(messageGen.getGameOverMessage(), 3000));
				dispatch(actions.resetGame(10000));
			}
		} else {
			dispatch(actions.showMessage(messageGen.getEncounterMissMessage(NPC), 1000));
		}
	};
};

function doAttack(encounter, stats, weapon, armour) {
	let NPC = NPCs.all[encounter.id];
	let augmentedStats = Object.assign({}, stats);
	augmentedStats = _.reduce(augmentedStats, (ret, data, id)=> {
		if (armour) {
			if (armour.stats[id] > 0) {
				ret[id] += armour.stats[id];
			}
		}
		if (weapon) {
			if (weapon.stats[id] > 0) {
				ret[id] += weapon.stats[id];
			}
		}
		return ret;
	}, augmentedStats);
	let damage = algorithms.calculatePhysicalDamage(augmentedStats, NPC.stats);

	let enemyAlive = (encounter.hp - damage) > 0;
	return (dispatch)=> {
		if (damage >= 0) {
			dispatch(actions.showMessage(messageGen.getEncounterAttackMessage(NPC, damage), 0));
			dispatch(actions.damageNPC(damage));
			dispatch(actions.showMessage(messageGen.getEncounterDamageTakenMessage(NPC), 0));
		} else {
			dispatch(actions.showMessage(messageGen.getPlayerMissMessage(), 0));
		}
		if (enemyAlive) {
			dispatch(doEnemyAttack(NPC, stats, weapon, armour));
		} else {
			dispatch(actions.showMessage(messageGen.getEncounterWinMessage(NPC), 1000));
			dispatch(actions.defeatEnemy(NPC));
			dispatch(actions.setInputExpected(constants.EXPECTING_MOVEMENT));
			//TODO: reward exp and items (possible items should be specified in the NPC json)
		}
	};
};

function observe(encounter) {
	let NPC = NPCs.all[encounter.id];
	return (dispatch)=> {
		dispatch(actions.showMessage(messageGen.getEncounterMessage(NPC), 0));
		dispatch(actions.showMessage(messageGen.getEncounterObserveMessage(encounter), 0));
	};
};

function checkAndPerformBattleAction(input, encounter, stats, weapon, armour) {
	if (input.toUpperCase().indexOf("OBSERVE") > -1) {
		return (dispatch)=> {
			dispatch(observe(encounter));
		};
	} else if (input.toUpperCase().indexOf("ATTACK") > -1) {
		return (dispatch)=> {
			dispatch(doAttack(encounter, stats, weapon, armour));
		};
	} else {
		return (dispatch)=> {
			dispatch(actions.showMessage(messageGen.getPlayerBattleFailMessage(), 0));
		};
	}
	//TODO: Add flee, use item, etc
};

export default (input, expectedInput, prevInput, playerPos, player, map)=> {
	let name = player.name,
		inventory = player.inventory,
		stats = player.stats,
		weapon = player.weapon,
		armour = player.armour;
	if (input.split(" ")[0].toUpperCase() === "RESET") { // If they want to give up and reset the game
		return (dispatch)=> {
			dispatch(actions.showMessage(messageGen.getPlayerWantResetMessage(), 0));
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
	} else if (map[0].length > 0 && expectedInput !== constants.EXPECTING_BATTLE && map[playerPos.y][playerPos.x].encounter) {
		let encounter = map[playerPos.y][playerPos.x].encounter,
			NPC = NPCs.all[encounter.id];
		if (input.toUpperCase().indexOf("TALK") > -1 && !NPC.hostile) {
			return (dispatch)=> {
				dispatch(actions.showMessage(messageGen.getEncounterTalkMessage(NPC), 0));
				dispatch(actions.showMessage(messageGen.getEncounterRandomTalkMessage(NPC), 1000));
			};
		} else if (input.toUpperCase().indexOf("ATTACK") > -1) {
			return (dispatch)=> {
				dispatch(actions.setInputExpected(constants.EXPECTING_BATTLE)); // Set to battle mode
				dispatch(doAttack(encounter, stats, weapon, armour)); // Make the first move
			};
		} else if (input.toUpperCase().indexOf("OBSERVE") > -1) {
			return (dispatch)=> {
				dispatch(observe(encounter));
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
				dispatch(actions.showMessage(messageGen.getOffWithYouMessage(), 1000));
				dispatch(actions.showMessage(messageGen.getLeaveTowerMessage(), 2000));
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
				dispatch(checkAndMovePlayer(input, playerPos, map, stats, weapon, armour));
			};
		case constants.EXPECTING_BATTLE:
			let encounter = map[playerPos.y][playerPos.x].encounter;
			return (dispatch)=> {
				dispatch(checkAndPerformBattleAction(input, encounter, stats, weapon, armour));
			};
		default:
			throw new Error("Missing input case for " + expectedInput);
	}
};
