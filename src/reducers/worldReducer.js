var initialState = require("./../initialstate"),
	constants = require("./../constants");

module.exports = function (state, action) {
	var updateMapVisibility = function(newState) {
		if (newState.playerPos.x > 0) {
			newState.map[newState.playerPos.y][newState.playerPos.x-1].seen = true;
		}
		if (newState.playerPos.y > 0) {
			newState.map[newState.playerPos.y-1][newState.playerPos.x].seen = true;
		}
		if (newState.playerPos.x < newState.map[0].length-1) {
			newState.map[newState.playerPos.y][newState.playerPos.x+1].seen = true;
		}
		if (newState.playerPos.y < newState.map.length-1) {
			newState.map[newState.playerPos.y+1][newState.playerPos.x].seen = true;
		}
		return newState;
	};

	var newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case constants.ADD_MAP:
			newState.displayMap = true;
			newState.map = action.map;
			// Set player position
			newState.playerPos = action.position;
			// Make initially visible tiles visible
			newState = updateMapVisibility(newState);
			return newState;
		case constants.MOVE:
			// TODO check validity of movement here too before making the move
			var newPosition = { x: newState.playerPos.x + action.movement.x, y: newState.playerPos.y + action.movement.y };
			newState.playerPos = newPosition;
			newState = updateMapVisibility(newState);
			return newState;
		case constants.RESET:
			return initialState().world;
		default:
			return state || initialState().world;
	}
};