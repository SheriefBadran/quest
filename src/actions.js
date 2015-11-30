var constants = require("./constants");

module.exports = {
	showMessage: function(message, timeout) {
		return function(dispatch) {
				dispatch({ type: constants.QUEUE_MESSAGE, message: message });
			setTimeout(function() {
				dispatch({ type: constants.SHOW_MESSAGE });
			}, timeout);
		}
	},
	setName: function(name) {
		return { type: constants.SET_NAME, name: name };
	},
	setStats: function(stats) {
		return { type: constants.SET_STATS, stats: stats };
	},
	setDisplayStats: function(display, timeout) {
		return function(dispatch) {
				dispatch({ type: constants.PREP_STATS, display: display });
			setTimeout(function() {
				dispatch({ type: constants.DISPLAY_STATS, display: display });
			}, timeout);
		}
	},
	setInputExpected: function(inputType) {
		return { type: constants.SET_INPUT, input: inputType };
	},
	addItem: function(item, timeout) {
		return function(dispatch) {
				dispatch({ type: constants.QUEUE_ITEM, item: item });
	 		setTimeout(function() {
	 			dispatch({ type: constants.ADD_ITEM });
	 		}, timeout);
	 	}
	},
	removeItem: function(item) {
		return { type:constants.REMOVE_ITEM, item: item };
	},
	equipItem: function(item) {
		return { type:constants.EQUIP_ITEM, item: item };
	},
	setDisplayInventory: function(display, timeout) {
	 	return function(dispatch) {
	 			dispatch({ type: constants.PREP_INVENT, display: display });
	 		setTimeout(function() {
	 			dispatch({ type: constants.DISPLAY_INVENTORY, display: display });
	 		}, timeout);
	 	}
	},
	addMap: function(map, position, timeout) {
		return function(dispatch) {
				dispatch({ type: constants.PREP_MAP, map: map, position: position });
	 		setTimeout(function() {
	 			dispatch({ type: constants.ADD_MAP, map: map, position: position });
	 		}, timeout);
	 	}
	},
	movePlayer: function(movement) {
		return { type: constants.MOVE, movement: movement };
	},
	resetGame: function(timeout) {
		return function(dispatch) {
			setTimeout(function() {
				dispatch({ type: constants.RESET });
			}, timeout);
		}
	}
};