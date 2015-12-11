// It is important to note that due to the way these tests are set up, no delayed actions
// (i.e. via setTimeout) will be registered in the tests so any such action creator calls
// must also instantly call a dispatch.
//TODO: Use messageGen to check the actual contents of messages being sent against the messages + figure out how to check randomly generated messages

import { expect } from "chai";
import inputvalidation from "./../src/inputvalidation";
import constants from "./../src/constants";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Classes from "./../src/data/class";
import Weapons from "./../src/data/weapon";
import Items from "./../src/data/item";
import MapGen from "./../src/components/mapgen";
import sinon from "sinon";

function mockStore(getState, expectedActions, done) {
	if (!Array.isArray(expectedActions)) {
		throw new Error('expectedActions should be an array of expected actions.');
	}
	if (typeof done !== 'undefined' && typeof done !== 'function') {
		throw new Error('done should either be undefined or function.');
	}

	function mockStoreWithoutMiddleware() {
		return {
			getState() {
				return typeof getState === 'function' ? getState() : getState;
			},
			dispatch(action) {
				try {
					// Don't even slightly care about show message commands since we thoroughly test them in actiontests.js
					// and a queue message action will never appear without one
					if (action.type !== constants.SHOW_MESSAGE) {
						const expectedAction = expectedActions.shift();

						if (!expectedAction) {
							throw new Error("More dispatch calls than expected: " + action.type);
						}
						// Don't really care about the message contents, only the number of them
						expect(action.type).to.deep.equal(expectedAction.type);
						if (action.type !== constants.QUEUE_MESSAGE) {
							expect (action).to.deep.equal(expectedAction);
						}
					}

					return action;
				} catch (e) {
					done(e);
				}
			}
		};
	};

	const mockStoreWithMiddleware = applyMiddleware(thunk)(mockStoreWithoutMiddleware);

	return mockStoreWithMiddleware();
};

describe("input validation: 'reset'", ()=> {
	it("should react correctly when input is 'reset'", (done)=> {
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_RESET },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_CONF }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("reset", null, null, "Test"));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly on invalid input during reset confirmation", (done)=> {
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("asfasf", constants.EXPECTING_CONF, constants.EXPECTING_RESET, "Test", null, null, [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when input is 'yes' during reset confirmation", (done)=> {
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.DUMMY_RESET }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("Yes", constants.EXPECTING_CONF, constants.EXPECTING_RESET, "Test", null, null, [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when input is 'no' during reset confirmation", (done)=> {
		const expectedActions = [
			{ type: constants.SET_INPUT, input: constants.EXPECTING_RESET },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("No", constants.EXPECTING_CONF, constants.EXPECTING_RESET, "Test", null, null, [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
});
describe("input validation: 'equip'", ()=> {
	it("should react correctly when equipping an equippable item", (done)=> {
		const item = { name: "Test", equippable: true, prefix: "Test" };
		const expectedActions = [
			{ type: constants.EQUIP_ITEM, item: item },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("equip test", null, null, "Test", null, [ item ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when equipping an item with a multi-word name", (done)=> {
		const item = { name: "Test Hat Multi", equippable: true, prefix: "Test" };
		const expectedActions = [
			{ type: constants.EQUIP_ITEM, item: item },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("equip test hat multi", null, null, "Test", null, [ item ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when trying to equip something that cannot be equipped", (done)=> {
		const item = { name: "Test", equippable: false, prefix: "Test" };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("equip test", null, null, "Test", null, [ item ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when trying to equip something not in the player's inventory", (done)=> {
		const item = { name: "Test", equippable: true, prefix: "Test" };
		const item2 = { name: "Test2", equippable: true, prefix: "Test2" };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("equip test", null, null, "Test", null, [ item2 ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if player enters only the word 'equip'", (done)=> {
		const item = { name: "Test", equippable: true, prefix: "Test" };
		const expectedActions = [];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("equip", null, null, "Test", null, [ item ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if the player attempts to equip with an empty inventory", (done)=> {
		const expectedActions = [];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("equip test", constants.EXPECTING_MOVEMENT, null, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
});
describe("input validation: 'look at'", ()=> {
	it("should react correctly when looking at an item", (done)=> {
		const item = { name: "Test", equippable: false, prefix: "Test" };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look at test", null, null, "Test", null, [ item ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when looking at an item with a multi-word name", (done)=> {
		const item = { name: "Test Hat Multi", equippable: false, prefix: "Test" };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look at test hat multi", null, null, "Test", null, [ item ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when looking at an equippable item", (done)=> {
		const item = { name: "Test", equippable: true, stats: { hp: 0, mp: 0, str: 0, mag: 0, dex: 0, def: 0 }, prefix: "est" };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look at test", null, null, "Test", null, [ item ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when trying to look at something not in the player's inventory", (done)=> {
		const item = { name: "Test", equippable: true, prefix: "Test" };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look at house", null, null, "Test", null, [ item ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if player enters only the words 'look at'", (done)=> {
		const item = { name: "Test", equippable: true, prefix: "Test" };
		const expectedActions = [];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look at", null, null, "Test", null, [ item ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if the player attempts to look at something with an empty inventory", (done)=> {
		const expectedActions = [];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look at test", constants.EXPECTING_MOVEMENT, null, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
});
describe("input validation: 'look around'", ()=> {
	it("should react correctly if the player attempts to look around in the centre of the map", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 1, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look around", constants.EXPECTING_MOVEMENT, null, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if the player attempts to look around in a field with an NPC", (done)=> {
		const tile = { type: "Grass" };
		const npcTile = { description: "Grassy", encounter: "elf" };
		const playerPos = { x: 1, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, npcTile, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look around", constants.EXPECTING_MOVEMENT, null, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should not cause errors if the player attempts to look around at position (0,0)", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 0, y: 0 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look around", constants.EXPECTING_MOVEMENT, null, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should not cause errors if the player attempts to look around at position (maxLength, maxHeight)", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 2, y: 2 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("look around", constants.EXPECTING_MOVEMENT, null, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
});
describe("input validation: race selection", ()=> {
	it("should react correctly if the player selects a valid race", (done)=> {
		const race = Classes["Elf"];
		const expectedActions = [
			{ type: constants.SET_STATS, stats: race.stats },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_CONF },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("elf", constants.EXPECTING_RACE, null, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if the race name begins with a consonant", (done)=> {
		const race = Classes["Human"];
		const expectedActions = [
			{ type: constants.SET_STATS, stats: race.stats },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_CONF },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("human", constants.EXPECTING_RACE, null, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if the player selects an invalid race", (done)=> {
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("fakerace", constants.EXPECTING_RACE, null, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to invalid input during race confirmation", (done)=> {
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("asd", constants.EXPECTING_CONF, constants.EXPECTING_RACE, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to 'no' during race confirmation", (done)=> {
		const expectedActions = [
			{ type: constants.SET_INPUT, input: constants.EXPECTING_RACE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("no", constants.EXPECTING_CONF, constants.EXPECTING_RACE, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to 'yes' during race confirmation", (done)=> {
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.PREP_STATS, display: true },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_WEAPON }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("yes", constants.EXPECTING_CONF, constants.EXPECTING_RACE, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
});
describe("input validation: weapon selection", ()=> {
	it("should react correctly if the player selects a valid weapon initially", (done)=> {
		const weapon = Weapons.all["Sword"];
		const expectedActions = [
			{ type: constants.QUEUE_ITEM, item: weapon },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_CONF },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("sword", constants.EXPECTING_WEAPON, null, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if the player selects a valid weapon on second try", (done)=> {
		const weapon1 = Weapons.all["Sword"];
		const weapon2 = Weapons.all["Bow"];
		const expectedActions = [
			{ type: constants.REMOVE_ITEM, item: weapon1 },
			{ type: constants.QUEUE_ITEM, item: weapon2 },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_CONF },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("bow", constants.EXPECTING_WEAPON, null, "Test", null, [ weapon1 ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if the player selects an invalid weapon", (done)=> {
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("fakeweapon", constants.EXPECTING_WEAPON, null, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to invalid input during weapon confirmation", (done)=> {
		const weapon = Weapons.all["Sword"];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("asd", constants.EXPECTING_CONF, constants.EXPECTING_WEAPON, "Test", null, [ weapon ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to 'no' during weapon confirmation", (done)=> {
		const weapon = Weapons.all["Sword"];
		const expectedActions = [
			{ type: constants.SET_INPUT, input: constants.EXPECTING_WEAPON },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("no", constants.EXPECTING_CONF, constants.EXPECTING_WEAPON, "Test", null, [ weapon ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to 'yes' during weapon confirmation", (done)=> {
		const weapon = Weapons.all["Sword"];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.PREP_INVENT, display: true },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_ANYTHING }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("yes", constants.EXPECTING_CONF, constants.EXPECTING_WEAPON, "Test", null, [ weapon ], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
});
describe("input validation: set name", ()=> {
	it("should react correctly to a name with valid length", (done)=> {
		const name = "Test"
		const expectedActions = [
			{ type: constants.SET_NAME, name: name },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_CONF },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation(name, constants.EXPECTING_NAME, null, "???", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to a name with minimum length", (done)=> {
		let name = "";
		for (let i = 0; i < constants.MIN_NAME_LENGTH; ++i) {
			name += "a";
		}
		const expectedActions = [
			{ type: constants.SET_NAME, name: name },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_CONF },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation(name, constants.EXPECTING_NAME, null, "???", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to a name with maximum length", (done)=> {
		let name = "";
		for (let i = 0; i < constants.MAX_NAME_LENGTH; ++i) {
			name += "a";
		}
		const expectedActions = [
			{ type: constants.SET_NAME, name: name },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_CONF },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation(name, constants.EXPECTING_NAME, null, "???", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to a name that is too short", (done)=> {
		let name = "";
		for (let i = 0; i < constants.MIN_NAME_LENGTH - 1; ++i) {
			name += "a";
		}
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation(name, constants.EXPECTING_NAME, null, "???", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to a name that is too long", (done)=> {
		let name = "";
		for (let i = 0; i <= constants.MAX_NAME_LENGTH; ++i) {
			name += "a";
		}
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation(name, constants.EXPECTING_NAME, null, "???", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to invalid input during name confirmation", (done)=> {
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("asd", constants.EXPECTING_CONF, constants.EXPECTING_NAME, "???", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to 'no' during name confirmation", (done)=> {
		const expectedActions = [
			{ type: constants.SET_INPUT, input: constants.EXPECTING_NAME },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("no", constants.EXPECTING_CONF, constants.EXPECTING_NAME, "???", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly to 'yes' during name confirmation", (done)=> {
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_RACE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("yes", constants.EXPECTING_CONF, constants.EXPECTING_NAME, "???", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
});
describe("input validation: move player", ()=> {
	it("should react correctly if trying to move north with no obstruction", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 1, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		let movement = { x: 0, y: -1 };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.MOVE, movement: movement }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("north", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if trying to move east with no obstruction", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 1, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		let movement = { x: 1, y: 0 };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.MOVE, movement: movement }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("east", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if trying to move south with no obstruction", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 1, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		let movement = { x: 0, y: 1 };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.MOVE, movement: movement }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("south", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if trying to move west with no obstruction", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 1, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		let movement = { x: -1, y: 0 };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.MOVE, movement: movement }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("west", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if trying to move off the map to the north", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 0, y: 0 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("north", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if trying to move off the map to the east", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 2, y: 0 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("east", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if trying to move off the map to the south", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 0, y: 2 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("south", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if trying to move off the map to the west", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 0, y: 0 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("west", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if an obstacle lies to the north", (done)=> {
		const tile = { description: "Grassy" };
		const obstacle = { description: "Stony", obstacle: true };
		const playerPos = { x: 1, y: 2 };
		const map = [ [ tile, tile, tile ], [ tile, obstacle, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("north", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if an obstacle lies to the east", (done)=> {
		const tile = { description: "Grassy" };
		const obstacle = { description: "Stony", obstacle: true };
		const playerPos = { x: 0, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, obstacle, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("east", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if an obstacle lies to the south", (done)=> {
		const tile = { description: "Grassy" };
		const obstacle = { description: "Stony", obstacle: true };
		const playerPos = { x: 1, y: 0 };
		const map = [ [ tile, tile, tile ], [ tile, obstacle, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("south", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly if an obstacle lies to the west", (done)=> {
		const tile = { description: "Grassy" };
		const obstacle = { description: "Stony", obstacle: true };
		const playerPos = { x: 2, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, obstacle, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("west", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when moving to a tile with an encounter", (done)=> {
		const tile = { description: "Grassy" };
		const encounter = { description: "Stony", encounter: "elf" };
		const playerPos = { x: 1, y: 2 };
		const map = [ [ tile, tile, tile ], [ tile, encounter, tile ], [ tile, tile, tile ] ];
		let movement = { x: 0, y: -1 };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.MOVE, movement: movement },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("north", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
});
describe("input validation: encounter", ()=> {
	it("should react correctly when using 'talk' in a tile with an encounter", (done)=> {
		const tile = { description: "Grassy" };
		const encounter = { description: "Stony", encounter: "elf" };
		const playerPos = { x: 1, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, encounter, tile ], [ tile, tile, tile ] ];
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("talk", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should react correctly when using 'talk' in a tile with no encounter", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 1, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		const expectedActions = [];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("talk", constants.EXPECTING_MOVEMENT, constants.EXPECTING_ANYTHING, "Test", playerPos, [], map));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
});
describe("input validation: misc", ()=> {
	beforeEach(function() {
		this.sinon = sinon.sandbox.create();
	});
	afterEach(function(){
		this.sinon.restore();
	});
	it("should react correctly to input during EXPECTING_ANYTHING", (done)=> {
		const tile = { description: "Grassy" };
		const playerPos = { x: 1, y: 1 };
		const map = [ [ tile, tile, tile ], [ tile, tile, tile ], [ tile, tile, tile ] ];
		sinon.stub(MapGen, "generateMap").returns({ map: map, start: playerPos });
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_ITEM, item: Items.map },
			{ type: constants.PREP_MAP, map: map, position: playerPos },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.SET_INPUT, input: constants.EXPECTING_MOVEMENT }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("asgasg", constants.EXPECTING_ANYTHING, constants.EXPECTING_CONF, "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		done();
	});
	it("should throw an exception if receiving input while input is disabled", ()=> {
		expect(inputvalidation.bind(inputvalidation, "asga", constants.DISABLED, null, "Test", null, [], [[]])).to.throw(/input was disabled/);
	});
	it("should throw an exception if receiving a missing input case for expectedInput", ()=> {
		expect(inputvalidation.bind(inputvalidation, "gasg", "FakeInput", null, "Test", null, [], [[]])).to.throw(/Missing input case/);
	});
	it("should react correctly if receiving a missing input case for previousInput during confirmation", (done)=> {
		sinon.spy(console, "log");
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.QUEUE_MESSAGE },
			{ type: constants.SET_INPUT, input: constants.DISABLED }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(inputvalidation("yes", constants.EXPECTING_CONF, "FakeInput", "Test", null, [], [[]]));
		if (expectedActions.length > 0) {
			throw new Error("Last " + expectedActions.length + " actions not dispatched");
		}
		expect(console.log.calledWith("Missing case for confirmation.")).to.be.true;
		done();
	});
});