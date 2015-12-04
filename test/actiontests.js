import { expect } from "chai";
import actions from "./../src/actions";
import constants from "./../src/constants";
import { applyMiddleware } from "redux";
import thunk from "redux-thunk";

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
				const expectedAction = expectedActions.shift();

				try {
					expect(action).to.deep.equal(expectedAction);
					if (done && !expectedActions.length) {
						done();
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
		const item = "Item";
		const expectedAction = {
			type: constants.REMOVE_ITEM,
			item: item
		};
		expect(actions.removeItem(item)).to.deep.equal(expectedAction);
	});
	it ("should create an action to equip item", ()=> {
		const item = "Item";
		const expectedAction = {
			type: constants.EQUIP_ITEM,
			item: item
		};
		expect(actions.equipItem(item)).to.deep.equal(expectedAction);
	});
	it ("should create an action to move player", ()=> {
		const movement = { x: 0, y: -1 };
		const expectedAction = {
			type: constants.MOVE,
			movement: movement
		};
		expect(actions.movePlayer(movement)).to.deep.equal(expectedAction);
	});
});

describe("async actions", ()=> {
	it("should dispatch a QUEUE_MESSAGE action followed by a SEND_MESSAGE action", (done)=> {
		const message = { speaker: "Test", line: [{ text: "Test "}] };
		const expectedActions = [
			{ type: constants.QUEUE_MESSAGE, message: message },
			{ type: constants.SHOW_MESSAGE }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(actions.showMessage(message, 0));
	});
	it("should dispatch a PREP_STATS action followed by a DISPLAY_STATS action", (done)=> {
		const display = true;
		const expectedActions = [
			{ type: constants.PREP_STATS, display: display },
			{ type: constants.DISPLAY_STATS, display: display }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(actions.setDisplayStats(display, 0));
	});
	it("should dispatch a QUEUE_ITEM action followed by an ADD_ITEM action", (done)=> {
		const item = { name: "Item" };
		const expectedActions = [
			{ type: constants.QUEUE_ITEM, item: item },
			{ type: constants.ADD_ITEM }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(actions.addItem(item, 0));
	});
	it("should dispatch a PREP_INVENT action followed by a DISPLAY_INVENTORY action", (done)=> {
		const display = true;
		const expectedActions = [
			{ type: constants.PREP_INVENT, display: display },
			{ type: constants.DISPLAY_INVENTORY, display: display }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(actions.setDisplayInventory(display, 0));
	});
	it("should dispatch a PREP_MAP action followed by an ADD_MAP action", (done)=> {
		const map = [[{ type:"Grass" }]];
		const pos = { x: 0, y: 0 };
		const expectedActions = [
			{ type: constants.PREP_MAP, map: map, position: pos },
			{ type: constants.ADD_MAP, map: map, position: pos }
		];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(actions.addMap(map, pos, 0));
	});
	it("should dispatch a RESET action", (done)=> {
		const expectedActions = [{ type: constants.RESET }];
		const store = mockStore({}, expectedActions, done);
		store.dispatch(actions.resetGame(0));
	});

});