var constants = require("./constants");

module.exports = {
	showMessage: function(message, timeout) {
		return function(dispatch) {
			setTimeout(function() {
				dispatch({ type: constants.SHOW_MESSAGE, message: message });
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
			setTimeout(function() {
				dispatch({ type: constants.DISPLAY_STATS, display: display });
			}, timeout);
		}
	},
	setInputExpected: function(inputType) {
		return { type: constants.SET_INPUT, input: inputType };
	},
	addItem: function(item) {
		return { type: constants.ADD_ITEM, item: item};
	},
	removeItem: function(item) {
		return { type:constants.REMOVE_ITEM, item: item };
	},
	equipItem: function(item) {
		return { type:constants.EQUIP_ITEM, item: item };
	},
	setDisplayInventory: function(display, timeout) {
	 	return function(dispatch) {
	 		setTimeout(function() {
	 			dispatch({ type: constants.DISPLAY_INVENTORY, display: display });
	 		}, timeout);
	 	}
	},
	resetGame: function() {
		return function(dispatch) {
			setTimeout(function() {
				dispatch({ type: constants.RESET });
			}, 5000);
		}
	}
};