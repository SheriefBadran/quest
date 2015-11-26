var initialState = require("./../initialstate"),
	constants = require("./../constants");

module.exports = function (state, action) {
	var newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case constants.ADD_MAP:
			newState.displayMap = true;
			newState.map = action.map;
			return newState;
		case constants.RESET:
			return initialState().world;
		default:
			return state || initialState().world;
	}
};