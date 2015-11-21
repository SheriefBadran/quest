var initialState = require("./../initialstate"),
	constants = require("./../constants");

module.exports = function (state, action) {
	var newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case constants.SHOW_MESSAGE:
			newState.messages = [...newState.messages, action.message];
			return newState;
		default:
			return state || initialState().log;
	}
};