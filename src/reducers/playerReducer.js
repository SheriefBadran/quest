var initialState = require("./../initialstate");

module.exports = function (state, action) {
	var newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case "SET_NAME":
			newState.name = action.name;
			return newState;
		default:
			return state || initialState().player;
	}
};