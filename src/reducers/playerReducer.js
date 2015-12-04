import initialState from "./../initialstate";
import constants from "./../constants";

module.exports = (state, action)=> {
	let newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case constants.SET_NAME:
			newState.name = action.name;
			return newState;
		case constants.SET_STATS:
			newState.stats = action.stats;
			newState.stats.currenthp = newState.stats.hp;
			newState.stats.currentmp = newState.stats.mp;
			return newState;
		case constants.PREP_STATS:
			newState.prepStats = action.display;
			return newState;
		case constants.DISPLAY_STATS:
			newState.displayStats = action.display;
			delete newState.prepStats;
			return newState;
		case constants.QUEUE_ITEM:
			newState.itemQueue = [...newState.itemQueue, action.item ];
			return newState;
		case constants.ADD_ITEM:
			let item = newState.itemQueue.shift();
			newState.inventory = [...newState.inventory, item];
			return newState;
		case constants.REMOVE_ITEM:
			newState.inventory = [...newState.inventory];
			newState.inventory.splice(newState.inventory.indexOf(action.item), 1);
			return newState;
		case constants.EQUIP_ITEM:
			switch (action.item.type) {
				case constants.WEAPON:
					if (newState.inventory.indexOf(action.item) > -1) {
						newState.weapon = action.item;
					} else {
						throw new Error("No such weapon " + action.item.name + " in inventory!");
					}
					break;
				case constants.ARMOUR:
					if (newState.inventory.indexOf(action.item) > -1) {
						newState.armour = action.item;
					} else {
						throw new Error("No such armour " + action.item.name + " in inventory!");
					}
					break;
				default:
					throw new Error("Invalid item type passed to equipItem - " + action.item.name);
			}
			return newState;
		case constants.PREP_INVENT:
			newState.prepInvent = action.display;
			return newState;
		case constants.DISPLAY_INVENTORY:
			newState.displayInventory = action.display;
			delete newState.prepInvent;
			return newState;
		case constants.RESET:
			return initialState().player;
		default:
			return state || initialState().player;
	}
};