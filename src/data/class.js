import _ from "lodash";

let Classes = {
	Elf: require("./classes/elf"),
	Human: require("./classes/human"),
	Dwarf: require("./classes/dwarf")
}

Classes = _.reduce(Classes, (ret, data, id)=> {
	ret[id].stats.level = 1; // Add the level to each class
	ret[id].stats.currentexp = 0;
	return ret;
}, Classes);

export default Classes;