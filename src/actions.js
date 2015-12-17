// Used by inputvalidation.js to generate generic actions for dispatch

import constants from "./constants";

export default {
	showMessage(message, timeout) {
		return (dispatch)=> {
				dispatch({ type: constants.QUEUE_MESSAGE, message: message });
			setTimeout(()=> {
				dispatch({ type: constants.SHOW_MESSAGE });
			}, timeout);
		}
	},
	setName(name) {
		return { type: constants.SET_NAME, name: name };
	},
	setStats(stats) {
		return { type: constants.SET_STATS, stats: stats };
	},
	setDisplayStats(display, timeout) {
		return (dispatch)=> {
				dispatch({ type: constants.PREP_STATS, display: display });
			setTimeout(()=> {
				dispatch({ type: constants.DISPLAY_STATS, display: display });
			}, timeout);
		}
	},
	setInputExpected(inputType) {
		return { type: constants.SET_INPUT, input: inputType };
	},
	addItem(item, timeout) {
		return (dispatch)=> {
				dispatch({ type: constants.QUEUE_ITEM, item: item });
	 		setTimeout(()=> {
	 			dispatch({ type: constants.ADD_ITEM });
	 		}, timeout);
	 	}
	},
	removeItem(item) {
		return { type:constants.REMOVE_ITEM, item: item };
	},
	equipItem(item) {
		return { type:constants.EQUIP_ITEM, item: item };
	},
	setDisplayInventory(display, timeout) {
	 	return (dispatch)=> {
	 			dispatch({ type: constants.PREP_INVENT, display: display });
	 		setTimeout(()=> {
	 			dispatch({ type: constants.DISPLAY_INVENTORY, display: display });
	 		}, timeout);
	 	}
	},
	addMap(map, position, timeout) {
		return (dispatch)=> {
				dispatch({ type: constants.PREP_MAP, map: map, position: position });
	 		setTimeout(()=> {
	 			dispatch({ type: constants.ADD_MAP, map: map, position: position });
	 		}, timeout);
	 	}
	},
	movePlayer(movement) {
		return { type: constants.MOVE, movement: movement };
	},
	resetGame(timeout) {
		return (dispatch)=> {
				dispatch({ type: constants.DUMMY_RESET }); // dispatched for testing purposes - has no actual effect
			setTimeout(()=> {
				dispatch({ type: constants.RESET });
			}, timeout);
		}
	},
	damageNPC(damage) {
		return { type: constants.DAMAGE_NPC, damage: damage };
	},
	damagePlayer(damage, timeout) {
		return (dispatch)=> {
				dispatch({ type: constants.PREP_DAMAGE, damage: damage }); // dispatched for testing purposes - has no actual effect
			setTimeout(()=> {
				dispatch({ type: constants.DAMAGE_PLAYER });
			}, timeout);
		}
	},
	defeatEnemy(NPC) {
		return { type: constants.DEFEAT_ENEMY, enemy: NPC };
	}
};