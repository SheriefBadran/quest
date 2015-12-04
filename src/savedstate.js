import initialState from "./initialstate";

module.exports = (storage) => {
	storage = storage || window.localStorage;
	let state = JSON.parse(storage.getItem("Quest"));
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

		// If the version is not correct, we remove the localStorage and return default state to ensure nothing is broken during development
		//TODO: Make this unnecessary
		if (state.world.version !== initialState().world.version) {
			storage.removeItem("Quest");
			return;
		}
	}
	return state;
};