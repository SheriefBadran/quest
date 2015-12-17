import { expect } from "chai";
import initialstate from "./../src/initialstate";
import savedstate from "./../src/savedstate";
import sinon from "sinon";

let storage = {};

describe("savedstate", ()=> {
	beforeEach(function() {
		this.sinon = sinon.sandbox.create();
		storage.getItem = (key)=> {};
		storage.removeItem = (key)=> {};
	});
	afterEach(function(){
		this.sinon.restore();
	});
	it("should return null if calls for the key return null", ()=> {
		sinon.stub(storage, "getItem").returns(null);
		expect(savedstate(storage)).to.be.null;
		expect(storage.getItem.calledWith("Quest")).to.be.true;
		expect(storage.getItem.calledOnce).to.be.true;
	});
	it("should move messages from queue to messages if the queue is not empty", ()=> {
		let message1 = { speaker: "Test", line: "Line" };
		let message2 = { speaker: "Test2", line: "Line2" };
		let storedState = {
			log: {
				queue: [ message1, message2 ],
				messages: []
			},
			player: {},
			world: {
				version: initialstate().world.version
			}
		};
		sinon.stub(storage, "getItem").returns(JSON.stringify(storedState));
		expect(savedstate(storage)).to.deep.equal({
			log: {
				queue: [],
				messages: [ message1, message2 ]
			},
			player: {},
			world: {
				version: initialstate().world.version
			}
		});
		expect(storage.getItem.calledWith("Quest")).to.be.true;
		expect(storage.getItem.calledOnce).to.be.true;
	});
	it("should move messages from queue to messages if the queue is not empty and retain order", ()=> {
		let message1 = { speaker: "Test", line: "Line" };
		let message2 = { speaker: "Test2", line: "Line2" };
		let message3 = { speaker: "Test3", line: "Line3" };
		let storedState = {
			log: {
				queue: [ message2, message3 ],
				messages: [ message1 ]
			},
			player: {},
			world: {
				version: initialstate().world.version
			}
		};
		sinon.stub(storage, "getItem").returns(JSON.stringify(storedState));
		expect(savedstate(storage)).to.deep.equal({
			log: {
				queue: [],
				messages: [ message1, message2, message3 ]
			},
			player: {},
			world: {
				version: initialstate().world.version
			}
		});
		expect(storage.getItem.calledWith("Quest")).to.be.true;
		expect(storage.getItem.calledOnce).to.be.true;
	});
	it("should move items from queue to inventory if queue is not empty", ()=> {
		let item1 = { name: "Test" };
		let item2 = { name: "Test" };
		let storedState = {
			log: {},
			player: {
				itemQueue: [ item1, item2 ],
				inventory: [],
			},
			world: {
				version: initialstate().world.version
			}
		}
		sinon.stub(storage, "getItem").returns(JSON.stringify(storedState));
		expect(savedstate(storage)).to.deep.equal({
			log: {},
			player: {
				itemQueue: [],
				inventory: [ item1, item2 ],
			},
			world: {
				version: initialstate().world.version
			}
		});
		expect(storage.getItem.calledWith("Quest")).to.be.true;
		expect(storage.getItem.calledOnce).to.be.true;
	});
	it("should set displayStats and remove prepStats if prepStats is set", ()=> {
		let storedState = {
			log: {},
			player: {
				prepStats: true,
				displayStats: false
			},
			world: {
				version: initialstate().world.version
			}
		};
		sinon.stub(storage, "getItem").returns(JSON.stringify(storedState));
		expect(savedstate(storage)).to.deep.equal({
			log: {},
			player: {
				displayStats: true
			},
			world: {
				version: initialstate().world.version
			}
		});
		expect(storage.getItem.calledWith("Quest")).to.be.true;
		expect(storage.getItem.calledOnce).to.be.true;
	});
	it("should set displayInventory and remove prepInvent if prepInvent is set", ()=> {
		let storedState = {
			log: {},
			player: {
				prepInvent: true,
				displayInventory: false
			},
			world: {
				version: initialstate().world.version
			}
		};
		sinon.stub(storage, "getItem").returns(JSON.stringify(storedState));
		expect(savedstate(storage)).to.deep.equal({
			log: {},
			player: {
				displayInventory: true
			},
			world: {
				version: initialstate().world.version
			}
		});
		expect(storage.getItem.calledWith("Quest")).to.be.true;
		expect(storage.getItem.calledOnce).to.be.true;
	});
	it("should set displayMap, update map and playerPos, and remove prepMap if prepMap is set", ()=> {
		let storedState = {
			log: {},
			player: {},
			world: {
				version: initialstate().world.version,
				displayMap: false,
				prepMap: {
					map: [ [ 1, 2 ], [ 1, 2 ] ],
					position: {
						x: 5,
						y: 4
					}
				},
				map: [[]],
				playerPos: {
					x: 0,
					y: 0
				}
			}
		};
		sinon.stub(storage, "getItem").returns(JSON.stringify(storedState));
		expect(savedstate(storage)).to.deep.equal({
			log: {},
			player: {},
			world: {
				version: initialstate().world.version,
				displayMap: true,
				map: [ [ 1, 2 ], [ 1, 2 ] ],
				playerPos: {
					x: 5,
					y: 4
				}
			}
		});
		expect(storage.getItem.calledWith("Quest")).to.be.true;
		expect(storage.getItem.calledOnce).to.be.true;
	});
	it("should update player hp based on damage taken if takendamage is set", ()=> {
		let storedState = {
			log: {},
			player: {
				stats: {
					takendamage: 10,
					currenthp: 20
				}
			},
			world: {
				version: initialstate().world.version,
			}
		};
		sinon.stub(storage, "getItem").returns(JSON.stringify(storedState));
		expect(savedstate(storage)).to.deep.equal({
			log: {},
			player: {
				stats: {
					currenthp: 10
				}
			},
			world: {
				version: initialstate().world.version,
			}
		});
		expect(storage.getItem.calledWith("Quest")).to.be.true;
		expect(storage.getItem.calledOnce).to.be.true;
	});
	it("should call removeItem('Quest') and return undefined if version does not match", ()=> {
		let storedState = {
			log: {},
			player: {},
			world: {
				version: "wrong",
			}
		};
		sinon.stub(storage, "getItem").returns(JSON.stringify(storedState));
		sinon.stub(storage, "removeItem");
		expect(savedstate(storage)).to.be.undefined;
		expect(storage.getItem.calledWith("Quest")).to.be.true;
		expect(storage.getItem.calledOnce).to.be.true;
		expect(storage.removeItem.calledWith("Quest")).to.be.true;
		expect(storage.removeItem.calledOnce).to.be.true;
	});
});