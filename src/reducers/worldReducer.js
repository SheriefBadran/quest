import initialState from "./../initialstate";
import constants from "./../constants";
import NPCs from "./../data/npc";

export default (state, action)=> {
	let updateMapVisibility = (map, playerPos)=> {
		if (playerPos.x > 0) {
			map[playerPos.y][playerPos.x-1].seen = true;
		}
		if (playerPos.y > 0) {
			map[playerPos.y-1][playerPos.x].seen = true;
		}
		if (playerPos.x < map[0].length-1) {
			map[playerPos.y][playerPos.x+1].seen = true;
		}
		if (playerPos.y < map.length-1) {
			map[playerPos.y+1][playerPos.x].seen = true;
		}
		if (map[playerPos.y][playerPos.x].encounter) {
			map[playerPos.y][playerPos.x].encounter.seen = true;
		}
		return map;
	};

	let newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case constants.PREP_MAP:
			newState.prepMap = { map: action.map, position: action.position };
			newState.prepMap.map = updateMapVisibility(newState.prepMap.map, newState.prepMap.position);
			return newState;
		case constants.ADD_MAP:
			newState.displayMap = true;
			newState.map = action.map;
			// Set player position
			newState.playerPos = action.position;
			// Make initially visible tiles visible
			newState.map = updateMapVisibility(newState.map, newState.playerPos);
			// Remove the prep item
			delete newState.prepMap;
			return newState;
		case constants.MOVE:
			// TODO: check validity of movement here too before making the move
			let newPosition = { x: newState.playerPos.x + action.movement.x, y: newState.playerPos.y + action.movement.y };
			newState.playerPos = newPosition;
			newState.map = updateMapVisibility(newState.map, newState.playerPos);
			return newState;
		case constants.DAMAGE_NPC:
			let encounter = newState.map[newState.playerPos.y][newState.playerPos.x].encounter;
			encounter.hp -= action.damage;
			newState.map[newState.playerPos.y][newState.playerPos.x].encounter = encounter;
			return newState;
		case constants.DEFEAT_ENEMY:
			delete newState.map[newState.playerPos.y][newState.playerPos.x].encounter;
			return newState;
		case constants.RESET:
			return initialState().world;
		default:
			return state || initialState().world;
	}
};