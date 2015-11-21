var initialState = require("./../initialstate"),
	constants = require("./../constants");

module.exports = function (state, action) {
	var newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case constants.SET_INPUT:
			newState.previous = newState.awaiting;
			newState.awaiting = action.input;
			return newState;
		default:
			return state || initialState().input;
	}
};