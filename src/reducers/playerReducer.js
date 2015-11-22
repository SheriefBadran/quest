var initialState = require("./../initialstate"),
	constants = require("./../constants");

module.exports = function (state, action) {
	var newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case constants.SET_NAME:
			newState.name = action.name;
			return newState;
		case constants.SET_STATS:
			newState.stats = action.stats;
			newState.stats.currenthp = newState.stats.hp;
			newState.stats.currentmp = newState.stats.mp;
			return newState;
		case constants.DISPLAY_STATS:
			newState.display = action.display;
			return newState;
		default:
			return state || initialState().player;
	}
};