import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import actions from "./../actions";
import constants from "./../constants";
import messageGen from "./messagegen";
import { Input } from "react-bootstrap";
import Classes from "./../data/class";
import Weapons from "./../data/weapon";
import Items from "./../data/item";
import MapGen from "./mapgen";
import NPCs from "./../data/npc";

let proptypes = React.PropTypes;

let PlayerBar = React.createClass({
	displayName: "PlayerBar",
	propTypes: {
		addItem: proptypes.func.isRequired,
		addMap: proptypes.func.isRequired,
		equipItem: proptypes.func.isRequired,
		input: proptypes.string.isRequired,
		inventory: proptypes.array.isRequired,
		name: proptypes.string.isRequired,
		prevInput: proptypes.string.isRequired,
		removeItem: proptypes.func.isRequired,
		resetGame: proptypes.func.isRequired,
		setDisplayInventory: proptypes.func.isRequired,
		setDisplayStats: proptypes.func.isRequired,
		setInputExpected: proptypes.func.isRequired,
		setName: proptypes.func.isRequired,
		setStats: proptypes.func.isRequired,
		showMessage: proptypes.func.isRequired
	},
	getInitialState() {
		return { text: "" };
	},
	componentDidMount() {
 		this.refs.input.getInputDOMNode().focus();
	},
	handleChange(event) {
		this.setState({ text: event.target.value });
	},
	handleSubmit(event) {
		if (event.keyCode == 13) { // If it's enter key
			if (this.state.text) {
				this.validateAndSendInput(this.state.text);
				this.setState({ text: "" });
			}
		}
	},
	getRequestedItem(itemName) {
		let requestedItem = null;
		this.props.inventory.forEach(function(item) {
			if (item.name.toUpperCase() === itemName.toUpperCase()) {
				requestedItem = item;
			}
		}.bind(this));
		return requestedItem;
	},
	attemptEquip(input) {
		input = input.split(" ");

		if (input.length > 1) {

			let itemName = input[1];
			for (let i = 2; i < input.length; ++i) {
				itemName += " " + input[i];
			}

			let requestedItem = this.getRequestedItem(itemName);

			if (requestedItem) {
				if (requestedItem.equippable) {
					this.props.equipItem(requestedItem);
					this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You equip the " + requestedItem.prefix + " " }, { className: requestedItem.name, text: requestedItem.name }, { text: "." } ] }, 0);
				} else {
					this.props.showMessage({ speaker: constants.NARRATOR, line: [ { className: requestedItem.name, text: requestedItem.name }, { text: " cannot be equipped!" } ] }, 0);
				}
			} else {
				this.props.showMessage(messageGen.getNoSuchItemMessage(itemName), 0);
			}
		}
	},
	attemptLookAt(input) {
		input = input.split(" ");

		if (input.length > 2) {
			let itemName = input[2];
			for (let i = 3; i < input.length; ++i) {
				itemName += " " + input[i];
			}

			let requestedItem = this.getRequestedItem(itemName);

			if (requestedItem) {
				let prefix = ("AEIOU".indexOf(requestedItem.prefix.charAt(0).toUpperCase()) < 0) ? "A" : "An";
				this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: prefix + " " + requestedItem.prefix + " " }, { className: requestedItem.name, text: requestedItem.name }, { text: ". " + requestedItem.description } ] }, 0);
				if (requestedItem.type === constants.WEAPON || requestedItem.type === constants.ARMOUR) {
					this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: "The stats are Strength: " + requestedItem.stats.str + ", Magic: " + requestedItem.stats.mag + ", Dexterity: " + requestedItem.stats.dex + ", and Defence: " + requestedItem.stats.def + "." } ] }, 0);
				}
			} else {
				this.props.showMessage(messageGen.getNoSuchItemMessage(itemName), 0);
			}
		}
	},
	lookAround() {
		// TODO: make it look around the tile you're currently in too

		// We need to check what's in the four cardinal directions
		let message = "";

		// Make sure it's both on the map 
		if (this.props.playerPos.y -1 >= 0 ) {
			message += "To the north you see ";
			message += (this.props.map[this.props.playerPos.y - 1][this.props.playerPos.x].description || this.props.map[this.props.playerPos.y - 1][this.props.playerPos.x].type) + ". ";
		}
		
		if (this.props.playerPos.x + 1 < this.props.map[0].length) {
			message += "To the east you see ";
			message += (this.props.map[this.props.playerPos.y][this.props.playerPos.x + 1].description || this.props.map[this.props.playerPos.y][this.props.playerPos.x + 1].type) + ". ";
		}
		
		if (this.props.playerPos.y + 1 < this.props.map.length) {
			message += "To the south you see ";
			message += (this.props.map[this.props.playerPos.y + 1][this.props.playerPos.x].description || this.props.map[this.props.playerPos.y + 1][this.props.playerPos.x].type) + ". ";
		}
	
		if (this.props.playerPos.x -1 >= 0 ) {
			message += "To the west you see ";
			message += (this.props.map[this.props.playerPos.y][this.props.playerPos.x - 1].description || this.props.map[this.props.playerPos.y][this.props.playerPos.x - 1].type) + ". ";
		}

		if (this.props.map[this.props.playerPos.y][this.props.playerPos.x].encounter) {
			let encounter = NPCs.all[this.props.map[this.props.playerPos.y][this.props.playerPos.x].encounter];
			this.props.showMessage({ speaker: constants.NARRATOR, line: encounter.description }, 0);
		}

		this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: message } ] }, 0);
	},
	checkAndSetName(input) {
		// Validate the length of the name
		let message;
		if (input.length > constants.MAX_NAME_LENGTH || input.length < constants.MIN_NAME_LENGTH) {
			message = { speaker: constants.WIZARD, line: [ { text: "Hmmm... are you sure about that? Around here, names are usually between " + constants.MIN_NAME_LENGTH + " and " + constants.MAX_NAME_LENGTH + " characters in length! How about trying again?" } ] };
		} else {
			message = { speaker: constants.WIZARD, line: [ { text: input + " you say? Weird name... are you sure about that?" } ] };
			this.props.setName(input);
			this.props.setInputExpected(constants.EXPECTING_CONF);
		}
		this.props.showMessage({ speaker: constants.PLAYER, line: [ { text: "I'm " + input + "." } ] }, 0);
		this.props.showMessage(message, 1000); // Display the message
	},
	checkAndSelectRace(input) {
		let playerMessage;
		let message;

		let raceOptions = [];

		for (let raceName in Classes) {
			if (Classes.hasOwnProperty(raceName)) {
				raceOptions.push(raceName);
			}
		}

		// Check if it's a valid race
		let valid = false;
		let chosenRace;
		for (let i = 0; i < raceOptions.length; ++i) {
			if (input.toUpperCase().indexOf(raceOptions[i].toUpperCase()) > -1) { // Check if it's mentioned anywhere in the input
				valid = true;
				chosenRace = raceOptions[i];
				break;
			}
		}

		if (valid) {
			let prefix = ("AEIOU".indexOf(input.charAt(0).toUpperCase()) < 0) ? "A" : "An";
			playerMessage = { speaker: constants.PLAYER, line: [ { text: "I'm " + prefix.toLowerCase() + " " + chosenRace + "... I think?" } ] };
			message = { speaker: constants.WIZARD, line: [ { text: "Aha! " + prefix + " " }, { className: chosenRace, text: chosenRace }, { text: " eh? " + Classes[chosenRace].description + " Are you sure about this?" } ] };
			this.props.setStats(Classes[chosenRace].stats);
			this.props.setInputExpected(constants.EXPECTING_CONF);
		} else { // If it's not a valid race then we do a fail again
			playerMessage = messageGen.getPlayerFail();
			message = messageGen.getMultiChoiceFailMessage(this.props.input, raceOptions, this.props.name);
		}

		this.props.showMessage(playerMessage, 0);
		this.props.showMessage(message, 1000); // Display the message
	},
	checkAndSelectStarterWeapon(input) {
		let playerMessage;
		let message;

		let weaponOptions = [];

		for (let weaponName in Weapons.starter) {
			if (Weapons.starter.hasOwnProperty(weaponName)) {
				weaponOptions.push(weaponName);
			}
		}

		// Check validity
		let valid = false;
		let chosenWeapon; // An object

		for (let i = 0; i < weaponOptions.length; ++i) {
			if (input.toUpperCase().indexOf(weaponOptions[i].toUpperCase()) > -1) { // Check if it's mentioned anywhere in the input
				valid = true;
				chosenWeapon = Weapons.starter[weaponOptions[i]];
				break;
			}
		}

		if (valid) {
			playerMessage = { speaker: constants.PLAYER, line: [ { text: "I think I'll take the " + chosenWeapon.name + "." } ] };
			message = { speaker: constants.WIZARD, line: [ { text: "A fine choice! " + chosenWeapon.description + " Is this what you really want?" } ] };
			if (this.props.inventory.length > 0) { // Remove the item if it was added in a previous cycle
				this.props.removeItem(this.props.inventory[this.props.inventory.length-1]);
			}
			this.props.addItem(chosenWeapon, 0);
			this.props.setInputExpected(constants.EXPECTING_CONF);
		} else {
			playerMessage = messageGen.getPlayerFail();
			message = messageGen.getMultiChoiceFailMessage(this.props.input, weaponOptions, this.props.name);
		}

		this.props.showMessage(playerMessage, 0);
		this.props.showMessage(message, 1000); // Display the message
	},
	checkAndValidateConfirmation(input) {
		let playerMessage;
		let message;
		if (input.toUpperCase() === "YES" || input.toUpperCase() === "Y") {
			playerMessage = messageGen.getPlayerYes();
			message = messageGen.getConfirmMessage(this.props.prevInput, this.props.name);
			this.props.showMessage(playerMessage, 0);
			this.props.showMessage(message, 1000); // Display the message
			switch (this.props.prevInput) {
				case constants.EXPECTING_NAME:
					this.props.showMessage(messageGen.getRaceMessage(this.props.name, Classes), 2000);
					this.props.setInputExpected(constants.EXPECTING_RACE);
					break;
				case constants.EXPECTING_RACE:
					this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: "Your status has been updated!" } ] }, 2000);
					this.props.setDisplayStats(true, 2000);
					this.props.showMessage(messageGen.getWeaponMessage(this.props.name, Weapons.starter), 3000);
					this.props.setInputExpected(constants.EXPECTING_WEAPON);
					break;
				case constants.EXPECTING_WEAPON:
					let latestItem = this.props.inventory[this.props.inventory.length-1];
					let prefix = ("AEIOU".indexOf(latestItem.name.charAt(0).toUpperCase()) < 0) ? "A" : "An";
					let has = (latestItem.isPlural) ? "have" : "has";
					this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: prefix + " " + latestItem.prefix + " " }, { className: latestItem.name, text: latestItem.name }, { text: " " + has + " been added to your inventory!" } ] }, 2000);
					this.props.setDisplayInventory(true, 2000)
					this.props.showMessage({ speaker: constants.WIZARD, line: [ { text: "Don't forget to equip it before you head out into the world by using " }, { className: "confirm", text: "equip " + latestItem.name }, { text: "! Not my fault if you end up running around unarmed!" } ] }, 3000);
					this.props.showMessage({ speaker: constants.WIZARD, line: [ { text: "Ah, I can see from the look on your face that you have questions. Out with it then!" } ] }, 4000);
					this.props.setInputExpected(constants.EXPECTING_ANYTHING);
					break;
				case constants.EXPECTING_RESET:
					this.props.resetGame(5000);
					break;
				default:
					console.log("Missing case for confirmation.");
					this.props.setInputExpected(constants.DISABLED);
					break;
			}
		} else if (input.toUpperCase() === "NO" || input.toUpperCase() === "N") {
			let options = [];

			if (this.props.prevInput === constants.EXPECTING_RACE) {
				options = Classes;
			} else if (this.props.prevInput === constants.EXPECTING_WEAPON) {
				for (let weaponName in Weapons.starter) {
					if (Weapons.starter.hasOwnProperty(weaponName)) {
						options.push(weaponName);
					}
				}
			}

			playerMessage = messageGen.getPlayerNo();
			message = messageGen.getDenyMessage(this.props.prevInput, this.props.name, options);
			this.props.setInputExpected(this.props.prevInput);
			this.props.showMessage(playerMessage, 0);
			this.props.showMessage(message, 1000); // Display the message
		} else {
			playerMessage = messageGen.getPlayerFail();
			message = messageGen.getFailMessage(this.props.prevInput, this.props.name);
			this.props.showMessage(playerMessage, 0);
			this.props.showMessage(message, 1000); // Display the message
		}
	},
	checkAndMovePlayer(input) { //TODO: Possibly remove the text saying which direction you moved
		let wrongWay = { speaker: constants.NARRATOR, line: [ { text: "You can't go that way!" } ] };

		let movement = { x: 0, y: 0 };

		if (input.toUpperCase() === "N" || input.toUpperCase().indexOf("NORTH") > -1) {
			// Make sure it's both on the map and that it's not an obstacle
			if (this.props.playerPos.y -1 < 0 || this.props.map[this.props.playerPos.y - 1][this.props.playerPos.x].obstacle) {
				this.props.showMessage(wrongWay, 0);
			} else {
				movement = { x: 0, y: -1 };
				this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You move north." } ] }, 0);
			}
		} else if (input.toUpperCase() === "E" || input.toUpperCase().indexOf("EAST") > -1) {
			if (this.props.playerPos.x + 1 > this.props.map[0].length - 1 || this.props.map[this.props.playerPos.y][this.props.playerPos.x + 1].obstacle) {
				this.props.showMessage(wrongWay, 0);
			} else {
				movement = { x: 1, y: 0 };
				this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You move east." } ] }, 0);
			}
		} else if (input.toUpperCase() === "S" || input.toUpperCase().indexOf("SOUTH") > -1) {
			if (this.props.playerPos.y + 1 > this.props.map.length - 1 || this.props.map[this.props.playerPos.y + 1][this.props.playerPos.x].obstacle) {
				this.props.showMessage(wrongWay, 0);
			} else {
				movement = { x: 0, y: 1 };
				this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You move south." } ] }, 0);
			}
		} else if (input.toUpperCase() === "W" || input.toUpperCase().indexOf("WEST") > -1) {
			if (this.props.playerPos.x -1 < 0 || this.props.map[this.props.playerPos.y][this.props.playerPos.x - 1].obstacle) {
				this.props.showMessage(wrongWay, 0);
			} else {
				movement = { x: -1, y: 0 };
				this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You move west." } ] }, 0);
			}
		}

		if (movement.x !== 0 || movement.y !== 0 ) {
			this.props.movePlayer(movement);

			if (this.props.map[this.props.playerPos.y + movement.y][this.props.playerPos.x + movement.x].encounter) {
				let encounter = NPCs.all[this.props.map[this.props.playerPos.y + movement.y][this.props.playerPos.x + movement.x].encounter];
				this.props.showMessage({ speaker: constants.NARRATOR, line: encounter.description }, 0);
				encounter.seen = true;
			}
		}

		// TODO: things like description when entering special new area
	},
	validateAndSendInput(input) { // TODO: IMPORANT - MAKE THIS METHOD MUCH SMALLER
		if (input.split(" ")[0].toUpperCase() === "RESET") { // If they want to give up and reset the game
			this.props.showMessage({ speaker: constants.PLAYER, line: [ { text: "I can't take this anymore..." } ] }, 0);
			this.props.showMessage(messageGen.getResetMessage(this.props.name), 1000);
			this.props.setInputExpected(constants.EXPECTING_RESET);
			this.props.setInputExpected(constants.EXPECTING_CONF);
			return;
		} else if (input.split(" ")[0].toUpperCase() === "EQUIP" && this.props.inventory.length > 0) {	// If they're looking to equip and have an inventory
			this.attemptEquip(input);
			return;
		} else if (input.toUpperCase().indexOf("LOOK AT") > -1 && this.props.inventory.length > 0) { // If they want to look at an item and have an inventory
			this.attemptLookAt(input);
			return;
		} else if (input.toUpperCase().indexOf("LOOK AROUND") > -1 && this.props.input === constants.EXPECTING_MOVEMENT) { // If they want to look around
			this.lookAround();
			return;
		} else if (this.props.map[0].length > 0 && this.props.map[this.props.playerPos.y][this.props.playerPos.x].encounter) {
			let encounter = NPCs.all[this.props.map[this.props.playerPos.y][this.props.playerPos.x].encounter];
			if (input.toUpperCase().indexOf("TALK") > -1) {
				this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: "You attempt to strike up a conversation with the " }, { className: encounter.name, text: encounter.name }, { text: "." } ] }, 0);
				let randomResponse = encounter.talk[Math.floor(Math.random() * encounter.talk.length)];
				this.props.showMessage({ speaker: encounter.name, line: randomResponse }, 1000);
			}


			//TODO: Encounter stuff!
		}
		switch (this.props.input) {
			case constants.DISABLED:
				break; // Should not be doing anything
			case constants.EXPECTING_NAME:
				this.checkAndSetName(input);
				break;
			case constants.EXPECTING_RACE:
				this.checkAndSelectRace(input);
				break;
			case constants.EXPECTING_WEAPON:
				this.checkAndSelectStarterWeapon(input);
				break;
			case constants.EXPECTING_ANYTHING: // Making fun of the player at the end of the Wizard's intro
				this.props.showMessage(messageGen.getPlayerFail(), 0);
				this.props.showMessage({ speaker: constants.WIZARD, line: [ { text: "Oh, that's a pity... Well off with you then! Time to save the world or something!" } ] }, 1000);
				this.props.showMessage({ speaker: constants.NARRATOR, line: [ { text: "With a strength belying his frail physique, the " }, { className: constants.WIZARD, text: constants.WIZARD }, { text: " thrusts you from his crumbling tower and out into the unknown world..." } ] }, 2000);
				this.props.showMessage(messageGen.getAfterWizardMessage(), 4000);
				this.props.showMessage(messageGen.getMapIntroMessage(), 6000);
				this.props.showMessage(messageGen.getMapAddedMessage(), 8000);
				this.props.addItem(Items.map, 8000);
				let map = MapGen.generateMap();
				this.props.addMap(map.map, map.start, 8000);
				this.props.showMessage(messageGen.getMapContMessage(), 9000);
				this.props.showMessage(messageGen.getElfLeaveMessage(), 11000);
				this.props.setInputExpected(constants.EXPECTING_MOVEMENT);
				break;
			case constants.EXPECTING_CONF:
				this.checkAndValidateConfirmation(input);
				break;
			case constants.EXPECTING_MOVEMENT:
				this.checkAndMovePlayer(input);
				break;
			default:
				console.log("Missing input case for " + this.props.input);
				break;;
		}
	},
	render() {
		return (
			<Input 
				disabled={this.props.input === constants.DISABLED} 
				onChange={this.handleChange} 
				onKeyDown={this.handleSubmit} 
				placeholder="Type here!" 
				ref="input" 
				type="text"
				value={this.state.text} 
				/>
		);
	}
});

let mapStateToProps = (state)=> {
	return { input: state.input.awaiting, prevInput: state.input.previous, name: state.player.name, inventory: state.player.inventory, map: state.world.map,
				playerPos: state.world.playerPos };
};

let mapDispatchToProps = (dispatch)=> {
	return {
		showMessage(message, timeout) {
			dispatch(actions.showMessage(message, timeout));
		},
		setName(name) {
			dispatch(actions.setName(name));
		},
		setStats(stats) {
			dispatch(actions.setStats(stats));
		},
		setInputExpected(inputType) {
			dispatch(actions.setInputExpected(inputType));
		},
		setDisplayStats(display, timeout) {
			dispatch(actions.setDisplayStats(display, timeout));
		},
		addItem(item, timeout) {
			dispatch(actions.addItem(item, timeout));
		},
		removeItem(item) {
			dispatch(actions.removeItem(item));
		},
		equipItem(item) {
			dispatch(actions.equipItem(item));
		},
		setDisplayInventory(display, timeout) {
			dispatch(actions.setDisplayInventory(display, timeout));
		},
		addMap(map, position, timeout) {
			dispatch(actions.addMap(map, position, timeout));
		},
		movePlayer(movement) {
			dispatch(actions.movePlayer(movement));
		},
		resetGame(timeout) {
			dispatch(actions.resetGame(timeout));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerBar);