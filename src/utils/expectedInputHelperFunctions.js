import R from 'ramda';

// TODO: Refactor these methods to be a bit less imperative. Maybe devide into smaller functions composed?
export const expectedInputHelperFunctions = Object.freeze({
    checkAndSetName: R.curry((input, constants, dispatch, actions, messageGen) => {
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
    }),
    checkAndSelectRace: R.curry((classes, name, input, expectedInput, constants, dispatch, actions, messageGen) => {
    	let raceOptions = [];

    	for (let raceName in classes) {
    		if (classes.hasOwnProperty(raceName)) {
    			raceOptions.push(raceName);
    		}
    	}

    	// Check if it's a valid race
    	let valid = false;
    	let requestedRace;
    	for (let i = 0; i < raceOptions.length; ++i) {
    		if (input.toUpperCase().indexOf(raceOptions[i].toUpperCase()) > -1) { // Check if it's mentioned anywhere in the input
    			valid = true;
    			requestedRace = classes[raceOptions[i]];
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
    }),
    checkAndSelectStarterWeapon: R.curry((weapons, input, expectedInput, constants, dispatch, actions, player, messageGen) => {
        const {name, inventory} = player;
    	let weaponOptions = [];

    	for (let weaponName in weapons.starter) {
    		if (weapons.starter.hasOwnProperty(weaponName)) {
    			weaponOptions.push(weaponName);
    		}
    	}

    	// Check validity
    	let valid = false;
    	let chosenWeapon; // An object

    	for (let i = 0; i < weaponOptions.length; ++i) {
    		if (input.toUpperCase().indexOf(weaponOptions[i].toUpperCase()) > -1) { // Check if it's mentioned anywhere in the input
    			valid = true;
    			chosenWeapon = weapons.starter[weaponOptions[i]];
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
    }),
    checkAndValidateConfirmation: R.curry((classes, weapons, input, prevInput, constants, dispatch, actions, player, messageGen) => {
        const {name, inventory} = player;
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
    					dispatch(actions.showMessage(messageGen.getRaceMessage(name, classes), 2000));
    					dispatch(actions.setInputExpected(constants.EXPECTING_RACE));
    					break;
    				case constants.EXPECTING_RACE:
    					dispatch(actions.showMessage(messageGen.getStatusUpdatedMessage(), 2000));
    					dispatch(actions.setDisplayStats(true, 2000));
    					dispatch(actions.showMessage(messageGen.getWeaponMessage(name, weapons.starter), 3000));
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
    			options = classes;
    		} else if (prevInput === constants.EXPECTING_WEAPON) {
    			for (let weaponName in weapons.starter) {
    				if (weapons.starter.hasOwnProperty(weaponName)) {
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
    }),
    checkAndMovePlayer: R.curry((algorithms, input, constants, playerPos, map, dispatch, actions, NPCs, player, messageGen) => {
        //TODO: Possibly remove the text saying which direction you moved
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
    					dispatch(doEnemyAttack(constants, dispatch, actions, messageGen, algorithms, NPC, player));
    				}
    			}
    		}
    	};

    	//TODO: things like description when entering special new area
    }),
    checkAndPerformBattleAction: R.curry((algorithms, input, constants, dispatch, actions, NPCs, encounter, player, messageGen) => {
        const {weapon, armour, stats} = player;
    	if (input.toUpperCase().indexOf("OBSERVE") > -1) {
    		return (dispatch)=> {
    			dispatch(doObserve(dispatch, actions, messageGen, NPCs, encounter));
    		};
    	} else if (input.toUpperCase().indexOf("ATTACK") > -1) {
    		return (dispatch)=> {
    			dispatch(doAttack(algorithms, constants, dispatch, actions, messageGen, NPCs, encounter, player));
    		};
    	} else {
    		return (dispatch)=> {
    			dispatch(actions.showMessage(messageGen.getPlayerBattleFailMessage(), 0));
    		};
    	}
    	//TODO: Add flee, use item, etc
    })
});

export const doAttack = R.curry((algorithms, constants, dispatch, actions, messageGen, NPCs, encounter, player) => {
	let NPC = NPCs.all[encounter.id];
    const {weapon, armour, stats} = player;
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
			dispatch(doEnemyAttack(constants, dispatch, actions, messageGen, algorithms, NPC, player));
		} else {
			dispatch(actions.showMessage(messageGen.getEncounterWinMessage(NPC), 1000));
			dispatch(actions.defeatEnemy(NPC));
			dispatch(actions.setInputExpected(constants.EXPECTING_MOVEMENT));
			//TODO: reward exp and items (possible items should be specified in the NPC json)
		}
	};
});

const doEnemyAttack = (constants, dispatch, actions, messageGen, algorithms, NPC, player) => {
    const {weapon, armour, stats} = player;
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

export const doObserve = R.curry((dispatch, actions, messageGen, NPCs, encounter) => {
	let NPC = NPCs.all[encounter.id];
	return (dispatch)=> {
		dispatch(actions.showMessage(messageGen.getEncounterMessage(NPC), 0));
		dispatch(actions.showMessage(messageGen.getEncounterObserveMessage(encounter), 0));
	};
});

export const expectedAnythingDispatchable = R.curry((mapGen, items, constants, dispatch, actions, messageGen) => {
    let map = mapGen.generateMap();
    return (dispatch)=> {
        dispatch(actions.showMessage(messageGen.getPlayerFail(), 0));
        dispatch(actions.showMessage(messageGen.getOffWithYouMessage(), 1000));
        dispatch(actions.showMessage(messageGen.getLeaveTowerMessage(), 2000));
        dispatch(actions.showMessage(messageGen.getAfterWizardMessage(), 4000));
        dispatch(actions.showMessage(messageGen.getMapIntroMessage(), 6000));
        dispatch(actions.showMessage(messageGen.getMapAddedMessage(), 8000));
        dispatch(actions.addItem(items.map, 8000));
        dispatch(actions.addMap(map.map, map.start, 8000));
        dispatch(actions.showMessage(messageGen.getMapContMessage(), 9000));
        dispatch(actions.showMessage(messageGen.getElfLeaveMessage(), 11000));
        dispatch(actions.setInputExpected(constants.EXPECTING_MOVEMENT));
    };
});
