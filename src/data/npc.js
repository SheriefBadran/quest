import _ from "lodash";

let NPCs = {
	random: {
		elf: require("./npcs/elf.json")
	},
	all: {

	}
}

NPCs.all = Object.assign(NPCs.random); // Copy all he NPCs to the all category

NPCs.all = _.reduce(NPCs.all, (ret, data, id)=> { // Add an id corresponding to the key to each NPC
	ret[id].id = id;
	return ret;
}, NPCs.all);

module.exports = NPCs;