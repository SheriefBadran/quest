import _ from "lodash";

let NPCs = {
	random: {
		elf: require("./npcs/elf.json"),
		goblin: require("./npcs/goblin.json")
	},
	all: {

	}
}

NPCs.all = Object.assign(NPCs.random); // Copy all he NPCs to the all category

NPCs.all = _.reduce(NPCs.all, (ret, data, id)=> {
	ret[id].id = id; // Add an id corresponding to the key to each NPC
	if (!data.stats) { // If no stats are defined
		console.log("No stats defined for NPC '" + data.name + "', adding default.");
		ret[id].stats = {
			level: 1,
			hp: 5,
			mp: 0,
			str: 3,
			dex: 5,
			mag: 4,
			def: 2
		};
	}
	return ret;
}, NPCs.all);

export default NPCs;