module.exports = {
	generateMap: function() {
		var mapSize = 9; // TODO change to be randomised

		var map = new Array(mapSize);

		for (var y = 0; y < mapSize; ++y) {
			map[y] = new Array(mapSize);
		}

		for (var y = 0; y < map.length; ++y) {
			for (var x = 0; x < map[y].length; ++x) {
				//var rand = Math.floor(Math.random() * 2) + 1;

				//if (rand === 1) {
				//	map[y][x] = { type: "Mountain", visited: false };
				//} else {
					map[y][x] = { type: "grasslands", seen: false };
				//}
			}
		}

		map[5][4] = { type: "Wizard", seen: true, obstacle: true, description: "the crumbling ruins of an old tower. You probably shouldn't go back there" };

		var playerPos = { x: 4, y: 4 };

		return { map: map, start: playerPos };
	}
};