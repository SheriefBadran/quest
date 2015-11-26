module.exports = {
	generateMap: function() {
		var mapSize = 10; // TODO change to be randomised perhaps

		var map = new Array(mapSize);

		for (var x = 0; x < mapSize; ++x) {
			map[x] = new Array(mapSize);
		}

		for (var x = 0; x < map.length; ++x) {
			for (var y = 0; y < map[x].length; ++y) {
				var rand = Math.floor(Math.random() * 2) + 1;

				if (rand === 1) {
					map[x][y] = { type: "Mountain", visited: false };
				} else {
					map[x][y] = { type: "Grass", visited: false };
				}
			}
		}
		return map;
	}
};