let expect = require("chai").expect,
	actions = require("./../src/actions"),
	constants = require("./../src/constants");

describe("actions", ()=> {
	it("should create an action to set name", ()=> {
		const name = "Name";
		const expectedAction = {
			type: constants.SET_NAME,
			name: name
		};
		expect(actions.setName(name)).to.deep.equal(expectedAction);
	});
	it ("should create an action to set stats", ()=> {
		const stats = { hp: 5, mp: 5 };
		const expectedAction = {
			type: constants.SET_STATS,
			stats: stats
		};
		expect(actions.setStats(stats)).to.deep.equal(expectedAction);
	});
	it ("should create an action to set expected input", ()=> {
		const input = constants.EXPECTING_NAME;
		const expectedAction = {
			type: constants.SET_INPUT,
			input: input
		};
		expect(actions.setInputExpected(input)).to.deep.equal(expectedAction);
	});
	it ("should create an action to remove an item", ()=> {

	});
	it ("should create an action to equip item", ()=> {

	});
	it ("should create an action to move player", ()=> {

	});
});