var initialState = require("./../initialstate"),
	constants = require("./../constants");

module.exports = function (state, action) {
	var newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case constants.SET_INPUT:
			if (action.input === constants.EXPECTING_RESET) { // Shuffle these around so we don't lose where we are if there's a reset command
				if (newState.previous === constants.EXPECTING_RESET) { // If we're already in the reset period that means we're trying to cancel the reset
					action.input = newState.beforeReset; // revert to the old settings
					if (newState.beforeReset === constants.EXPECTING_CONF) { // If it was a conf before we tried to reset we need to grab the state that was before that
						newState.awaiting = newState.beforeResetIfConf;
					}
				} else {
					newState.beforeReset = newState.awaiting; // We're going into reset confirmation mode
					if (newState.beforeReset === constants.EXPECTING_CONF) { // If it's a conf we need to store the state before it too
						newState.beforeResetIfConf = newState.previous;
					}
				}
			}
			newState.previous = newState.awaiting;
			newState.awaiting = action.input;
			return newState;
		case constants.RESET:
			return initialState().input;
		default:
			return state || initialState().input;
	}
};