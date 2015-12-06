import { expect } from "chai";
import initialState from "./../src/initialstate";
import constants from "./../src/constants";
import inputReducer from "./../src/reducers/inputReducer";
import messageReducer from "./../src/reducers/messageReducer";
import playerReducer from "./../src/reducers/playerReducer";
import worldReducer from "./../src/reducers/worldReducer";

let reducer;

describe("input reducer", ()=> {
	it("should return the initial state", ()=> {
		expect(inputReducer(undefined, {})).to.deep.equal(initialState().input);
	});
	it("should return initial state on reset", ()=> {
		expect(
			inputReducer(
				{
					awaiting: constants.EXPECTING_CONF,
					previous: constants.EXPECTING_NAME,
					beforeReset: constants.EXPECTING_NAME,
					beforeResetIfConf: constants.EXPECTING_NAME
				}, 
				{ 
					type: constants.RESET 
				}
			)
		).to.deep.equal(initialState().input);
	});
	it("should update awaiting and previous on receiving a non-reset action", ()=> {
		expect(
			inputReducer(initialState().input, { type: constants.SET_INPUT, input: constants.EXPECTING_CONF })
		).to.deep.equal({
			awaiting: constants.EXPECTING_CONF,
			previous: constants.EXPECTING_NAME,
			beforeReset: constants.EXPECTING_NAME,
			beforeResetIfConf: constants.EXPECTING_NAME
		});
		expect(
			inputReducer(
				{
					awaiting: constants.EXPECTING_CONF,
					previous: constants.EXPECTING_NAME,
					beforeReset: constants.EXPECTING_NAME,
					beforeResetIfConf: constants.EXPECTING_NAME
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RACE 
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_RACE,
			previous: constants.EXPECTING_CONF,
			beforeReset: constants.EXPECTING_NAME,
			beforeResetIfConf: constants.EXPECTING_NAME
		});
	});
	it("should set before reset parameter if going into reset mode", ()=> {
		expect(
			inputReducer(
				{
					awaiting: constants.EXPECTING_WEAPON,
					previous: constants.EXPECTING_CONF,
					beforeReset: constants.EXPECTING_RACE,
					beforeResetIfConf: constants.EXPECTING_NAME
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RESET
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_RESET,
			previous: constants.EXPECTING_WEAPON,
			beforeReset: constants.EXPECTING_WEAPON,
			beforeResetIfConf: constants.EXPECTING_NAME
		});
	});
	it("should set before reset parameter and before reset conf if going into reset mode during confirmation", ()=> {
		expect(
			inputReducer(
				{
					awaiting: constants.EXPECTING_CONF,
					previous: constants.EXPECTING_WEAPON,
					beforeReset: constants.EXPECTING_RACE,
					beforeResetIfConf: constants.EXPECTING_NAME
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RESET
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_RESET,
			previous: constants.EXPECTING_CONF,
			beforeReset: constants.EXPECTING_CONF,
			beforeResetIfConf: constants.EXPECTING_WEAPON
		});
	});
	it("should revert to before reset if receiving another reset command", ()=> {
		expect(
			inputReducer(
				{
					awaiting: constants.EXPECTING_CONF,
					previous: constants.EXPECTING_RESET,
					beforeReset: constants.EXPECTING_CONF,
					beforeResetIfConf: constants.EXPECTING_WEAPON
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RESET
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_CONF,
			previous: constants.EXPECTING_WEAPON,
			beforeReset: constants.EXPECTING_CONF,
			beforeResetIfConf: constants.EXPECTING_WEAPON
		});
		expect(
			inputReducer(
				{
					awaiting: constants.EXPECTING_CONF,
					previous: constants.EXPECTING_RESET,
					beforeReset: constants.EXPECTING_NAME,
					beforeResetIfConf: constants.EXPECTING_WEAPON
				},
				{ 
					type: constants.SET_INPUT, 
					input: constants.EXPECTING_RESET
				}
			)
		).to.deep.equal({
			awaiting: constants.EXPECTING_NAME,
			previous: constants.EXPECTING_CONF,
			beforeReset: constants.EXPECTING_NAME,
			beforeResetIfConf: constants.EXPECTING_WEAPON
		});
	});
});

describe("message reducer", ()=> {
	it("should return the initial state", ()=> {
		expect(messageReducer(undefined, {})).to.deep.equal(initialState().log);
	});
	it("should return initial state on reset", ()=> {
		expect(
			messageReducer(
				{
					queue: [],
					messages: [
						{ speaker: "Test" }
					]
				}, 
				{ 
					type: constants.RESET 
				}
			)
		).to.deep.equal(initialState().log);
	});
	it("should add a message to the message queue", ()=> {
		expect(
			messageReducer(
				{
					queue: [ { text: "Message 1" } ],
					messages: []
				},
				{
					type: constants.QUEUE_MESSAGE,
					message: { text: "Message 2" }
				}
			)
		).to.deep.equal({
			queue: [ { text: "Message 1" }, { text: "Message 2" }],
			messages: []
		});
	});
	it("should move message from queue to messages", ()=> {
		expect(
			messageReducer(
				{
					queue: [ { text: "Message 2" } ],
					messages: [ { text: "Message 1" } ]
				},
				{
					type: constants.SHOW_MESSAGE
				}
			)
		).to.deep.equal({
			queue: [],
			messages: [ { text: "Message 1" }, { text: "Message 2" } ]
		});
	});
});

describe("player reducer", ()=> {
	it("should return the initial state", ()=> {
		expect(playerReducer(undefined, {})).to.deep.equal(initialState().player);
	});
	it("should return initial state on reset", ()=> {
		expect(
			playerReducer(
				{
					name: "Hello",
					displayStats: true,
					stats: {
					},
					itemQueue: [],
					inventory: [],
					displayInventory: false,
					weapon: null,
					armour: null
				}, 
				{ 
					type: constants.RESET 
				}
			)
		).to.deep.equal(initialState().player);
	});
	it("should change the name when SET_NAME is provided", ()=> {
		expect(
			playerReducer(initialState().player, 
				{ 
					type: constants.SET_NAME, 
					name: "Test" 
				}
			)
		).to.deep.equal({
			name: "Test",
			displayStats: false,
			stats: {
			},
			itemQueue: [],
			inventory: [],
			displayInventory: false,
			weapon: null,
			armour: null
		});
	});
	it("should update stats and add current hp and mp when SET_STATS is provided", ()=> {
		expect(
			playerReducer(initialState().player,
				{
					type: constants.SET_STATS,
					stats: {
						race: "Elf",
						hp: 20,
						mp: 10,
						str: 3,
						dex: 5,
						mag: 4,
						def: 2
					}
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: false,
			stats: {
				race: "Elf",
				hp: 20,
				currenthp: 20,
				mp: 10,
				currentmp: 10,
				str: 3,
				dex: 5,
				mag: 4,
				def: 2
			},
			itemQueue: [],
			inventory: [],
			displayInventory: false,
			weapon: null,
			armour: null
		});
	});
	it("should set prepStats when PREP_STATS is provided", ()=> {
		expect(
			playerReducer(initialState().player,
				{
					type: constants.PREP_STATS,
					display: true
				}
			)
		).to.deep.equal({
			name: "???",
			prepStats: true,
			displayStats: false,
			stats: {
			},
			itemQueue: [],
			inventory: [],
			displayInventory: false,
			weapon: null,
			armour: null
		});
	});
	it("should set displayStats and remove prepStats when DISPLAY_STATS is provided", ()=> {
		expect(
			playerReducer({
					name: "???",
					prepStats: true,
					displayStats: false,
					stats: {
					},
					itemQueue: [],
					inventory: [],
					displayInventory: false,
					weapon: null,
					armour: null
				},
				{
					type: constants.DISPLAY_STATS,
					display: true
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: true,
			stats: {
			},
			itemQueue: [],
			inventory: [],
			displayInventory: false,
			weapon: null,
			armour: null
		});
	});
	it("should add item to empty item queue", ()=> {
		let item = { name: "Test" };
		expect(
			playerReducer(
				initialState().player,
				{
					type: constants.QUEUE_ITEM,
					item: item
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: false,
			stats: {
			},
			itemQueue: [ item ],
			inventory: [],
			displayInventory: false,
			weapon: null,
			armour: null
		});
	});
	it("should add item to item queue with other items", ()=> {
		let item = { name: "Test" },
			item2 = { name: "Test2" };
		expect(
			playerReducer(
				{
					name: "???",
					displayStats: false,
					stats: {
					},
					itemQueue: [ item ],
					inventory: [],
					displayInventory: false,
					weapon: null,
					armour: null
				},
				{
					type: constants.QUEUE_ITEM,
					item: item2
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: false,
			stats: {
			},
			itemQueue: [ item, item2 ],
			inventory: [],
			displayInventory: false,
			weapon: null,
			armour: null
		});
	});
	it("should move item from queue to inventory on ADD_ITEM", ()=> {
		let item = { name: "Test" },
			item2 = { name: "Test2" };
		expect(
			playerReducer(
				{
					name: "???",
					displayStats: false,
					stats: {
					},
					itemQueue: [ item, item2 ],
					inventory: [],
					displayInventory: false,
					weapon: null,
					armour: null
				},
				{
					type: constants.ADD_ITEM
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: false,
			stats: {
			},
			itemQueue: [ item2 ],
			inventory: [ item ],
			displayInventory: false,
			weapon: null,
			armour: null
		});
	});
	it("should remove specified item from inventory on REMOVE_ITEM", ()=> {
		let item = { name: "Test" },
			item2 = { name: "Test2" },
			item3 = { name: "Test3" };
		expect(
			playerReducer(
				{
					name: "???",
					displayStats: false,
					stats: {
					},
					itemQueue: [ ],
					inventory: [ item, item2, item3 ],
					displayInventory: false,
					weapon: null,
					armour: null
				},
				{
					type: constants.REMOVE_ITEM,
					item: item2
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: false,
			stats: {
			},
			itemQueue: [ ],
			inventory: [ item, item3 ],
			displayInventory: false,
			weapon: null,
			armour: null
		});
	});
	it("should equip weapon if weapon supplied to EQUIP_ITEM", ()=> {
		let weapon = { type: constants.WEAPON, name: "Sword" };
		expect(
			playerReducer(
				{
					name: "???",
					displayStats: false,
					stats: {
					},
					itemQueue: [],
					inventory: [ weapon ],
					displayInventory: false,
					weapon: null,
					armour: null
				},
				{
					type: constants.EQUIP_ITEM,
					item: weapon
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: false,
			stats: {
			},
			itemQueue: [],
			inventory: [ weapon ],
			displayInventory: false,
			weapon: weapon,
			armour: null
		});
	});
	it("should throw exception if weapon supplied to EQUIP_ITEM is not in inventory", ()=> {
		let weapon = { type: constants.WEAPON, name: "Sword" };
		expect(
			playerReducer.bind(
				playerReducer,
				{
					name: "???",
					displayStats: false,
					stats: {
					},
					itemQueue: [],
					inventory: [],
					displayInventory: false,
					weapon: null,
					armour: null
				},
				{
					type: constants.EQUIP_ITEM,
					item: weapon
				}
			)
		).to.throw(/No such weapon/);
	});
	it("should equip armour if armour supplied to EQUIP_ITEM", ()=> {
		let armour = { type: constants.ARMOUR, name: "Shield" };
		expect(
			playerReducer(
				{
					name: "???",
					displayStats: false,
					stats: {
					},
					itemQueue: [],
					inventory: [ armour ],
					displayInventory: false,
					weapon: null,
					armour: null
				},
				{
					type: constants.EQUIP_ITEM,
					item: armour
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: false,
			stats: {
			},
			itemQueue: [],
			inventory: [ armour ],
			displayInventory: false,
			weapon: null,
			armour: armour
		});
	});
	it("should throw exception if armour supplied to EQUIP_ITEM is not in inventory", ()=> {
		let armour = { type: constants.ARMOUR, name: "Shield" };
		expect(
			playerReducer.bind(
				playerReducer,
				{
					name: "???",
					displayStats: false,
					stats: {
					},
					itemQueue: [],
					inventory: [],
					displayInventory: false,
					weapon: null,
					armour: null
				},
				{
					type: constants.EQUIP_ITEM,
					item: armour
				}
			)
		).to.throw(/No such armour/);
	});
	it("should throw error if invalid item type is supplied to EQUIP_ITEM", ()=> {
		expect(
			playerReducer.bind(
				playerReducer,
				{
					name: "???",
					displayStats: false,
					stats: {
					},
					itemQueue: [],
					inventory: [],
					displayInventory: false,
					weapon: null,
					armour: null
				},
				{
					type: constants.EQUIP_ITEM,
					item: { type: "Hat", name: "Hat 1" }
				}
			)
		).to.throw(/Invalid item type/);
	});
	it("should set prepInvent when PREP_INVENT is supplied", ()=> {
		expect(
			playerReducer(
				initialState().player,
				{
					type: constants.PREP_INVENT,
					display: true
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: false,
			stats: {
			},
			itemQueue: [],
			inventory: [],
			prepInvent: true,
			displayInventory: false,
			weapon: null,
			armour: null
		});
	});
	it("should set displayInventory and remove prepInvent when DISPLAY_INVENTORY is supplied", ()=> {
		expect(
			playerReducer(
				{
					name: "???",
					displayStats: false,
					stats: {
					},
					itemQueue: [],
					inventory: [],
					prepInvent: true,
					displayInventory: false,
					weapon: null,
					armour: null	
				},
				{
					type: constants.DISPLAY_INVENTORY,
					display: true
				}
			)
		).to.deep.equal({
			name: "???",
			displayStats: false,
			stats: {
			},
			itemQueue: [],
			inventory: [],
			displayInventory: true,
			weapon: null,
			armour: null	
		});
	});
});

describe("world reducer", ()=> {
	let map;
	beforeEach(()=> {
		map = [
			[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
			[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
			[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
			[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
			[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}]
		];
	});
	it("should return the initial state", ()=> {
		expect(worldReducer(undefined, {})).to.deep.equal(initialState().world);
	});
	it("should return initial state on reset", ()=> {
		expect(
			worldReducer(
				{
					version: initialState().world.version,
					displayMap: false,
					map: map,
					playerPos: {
						x: 3,
						y: 2
					}
				}, 
				{ 
					type: constants.RESET 
				}
			)
		).to.deep.equal(initialState().world);
	});
	it("should set prepMap and mark tiles as seen when placed in centre with PREP_MAP", ()=> {
		let pos = { x: 2, y: 2 };
		expect(
			worldReducer(
				initialState().world,
				{
					type: constants.PREP_MAP,
					map: map,
					position: pos
				}
			)
		).to.deep.equal({
			version: initialState().world.version,
			displayMap: false,
			prepMap: {
				map: [
					[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
					[{seen: false},{seen:false},{seen:true},{seen:false},{seen:false}], 
					[{seen: false},{seen:true},{seen:false},{seen:true},{seen:false}], 
					[{seen: false},{seen:false},{seen:true},{seen:false},{seen:false}], 
					[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}]
				],
				position: pos
			},
			map: [[]],
			playerPos: {
				x: 0,
				y: 0
			}
		});
	});
	it("should set display map, update map and player pos, and remove prepMap with ADD_MAP", ()=> {
		let pos = { x: 2, y: 2 };
		expect(
			worldReducer(
				{
					version: initialState().world.version,
					displayMap: false,
					prepMap: {
						map: [
							[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
							[{seen: false},{seen:false},{seen:true},{seen:false},{seen:false}], 
							[{seen: false},{seen:true},{seen:false},{seen:true},{seen:false}], 
							[{seen: false},{seen:false},{seen:true},{seen:false},{seen:false}], 
							[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}]
						],
						position: pos
					},
					map: [[]],
					playerPos: {
						x: 0,
						y: 0
					}
				},
				{
					type: constants.ADD_MAP,
					map: map,
					position: pos
				}
			)
		).to.deep.equal({
			version: initialState().world.version,
			displayMap: true,
			map: [
				[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
				[{seen: false},{seen:false},{seen:true},{seen:false},{seen:false}], 
				[{seen: false},{seen:true},{seen:false},{seen:true},{seen:false}], 
				[{seen: false},{seen:false},{seen:true},{seen:false},{seen:false}], 
				[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}]
			],
			playerPos: pos
		});
	});
	it("should move player and update map visibility with MOVE", ()=> {
		let movement = { x: -1, y: 0 },
			pos = { x: 2, y: 2 };
		expect(
			worldReducer(
				{
					version: initialState().world.version,
					displayMap: true,
					map: [
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:true},{seen:false},{seen:false}], 
						[{seen: false},{seen:true},{seen:false},{seen:true},{seen:false}], 
						[{seen: false},{seen:false},{seen:true},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}]
					],
					playerPos: pos					
				},
				{
					type: constants.MOVE,
					movement: movement
				}
			)
		).to.deep.equal({
			version: initialState().world.version,
			displayMap: true,
			map: [
				[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
				[{seen: false},{seen:true},{seen:true},{seen:false},{seen:false}], 
				[{seen: true},{seen:true},{seen:true},{seen:true},{seen:false}], 
				[{seen: false},{seen:true},{seen:true},{seen:false},{seen:false}], 
				[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}]
			],
			playerPos: { x: pos.x + movement.x, y: pos.y + movement.y }
		});
	});
	it("should not throw an exception when updating visibility at array boundaries", ()=> {
		let movement = { x: 0, y: -1 },
			pos = { x: 0, y: 1};
		expect(
			worldReducer.bind(
				worldReducer,
				{
					version: initialState().world.version,
					displayMap: true,
					map: [
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}]
					],
					playerPos: pos	
				},
				{
					type: constants.MOVE,
					movement: movement
				}
			)
		).to.not.throw(Error);
		movement = { x: 1, y: 0};
		pos = { x: 3, y: 4};
		expect(
			worldReducer.bind(
				worldReducer,
				{
					version: initialState().world.version,
					displayMap: true,
					map: [
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}], 
						[{seen: false},{seen:false},{seen:false},{seen:false},{seen:false}]
					],
					playerPos: pos	
				},
				{
					type: constants.MOVE,
					movement: movement
				}
			)
		).to.not.throw(Error);
	});
});