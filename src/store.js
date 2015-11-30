/*
Redux Store
*/

var Redux = require("redux"),
	initialState = require("./initialstate"),
	messageReducer = require("./reducers/messageReducer"),
	playerReducer = require("./reducers/playerReducer"),
	inputReducer = require("./reducers/inputReducer"),
	worldReducer = require("./reducers/worldReducer"),
	thunk = require("redux-thunk"); // for asynch actions

var rootReducer = Redux.combineReducers({
	log: messageReducer,
	player: playerReducer,
	input: inputReducer,
	world: worldReducer
});

const saveLocal = store => next => action => {
	let result = next(action);
	localStorage.setItem("Quest", JSON.stringify(store.getState()));
  	return result;
};

const savedState = () => {
	var state = JSON.parse(localStorage.getItem("Quest"));
	// Before we return the state, we need to check if there's anything in the queues that should be moved to display.
	if (state) {
		if (state.log.queue && state.log.queue.length > 0) {
			state.log.queue.forEach(function(item) {
				state.log.messages.push(item);
			}.bind(this));
			state.log.queue = [];
		}

		if (state.player.itemQueue && state.player.itemQueue.length > 0) {
			state.player.itemQueue.forEach(function(item) {
				state.player.inventory.push(item);
			}.bind(this));
			state.player.itemQueue = [];
		}

		if (state.player.prepStats) {
			state.player.displayStats = state.player.prepStats;
			delete state.player.prepStats;
		}

		if (state.player.prepInvent) {
			state.player.displayInventory = state.player.prepInvent;
			delete state.player.prepInvent;
		}

		if (state.world.prepMap) {
			state.world.displayMap = true;
			state.world.map = state.world.prepMap.map;
			state.world.playerPos = state.world.prepMap.position;
			delete state.world.prepMap;
		}
	}
	return state;
};

module.exports = Redux.applyMiddleware(thunk, saveLocal)(Redux.createStore)(rootReducer, savedState() || initialState());

