// Used by playerbar.js for input validation and mapping to action dispatch
//TODO: Add actions to item/weapons so that you can use bash/whirl/etc for a mace (or other weapon) instead of just "attack" - i.e. abilities tied to weapons instead

import { runPolyfills } from "./utils/polyfills";
import constants from "./constants";
import {attemptTypes} from "./utils/enum";
import actions from "./actions";
import messageGen from "./components/messagegen";
import Classes from "./data/class";
import Weapons from "./data/weapon";
import Items from "./data/item";
import MapGen from "./components/mapgen";
import NPCs from "./data/npc";
import algorithms from "./algorithms";
import { readInputAndCreateDispatchable, observeCommand, generateDispatchable } from "./utils/inputValidationHelpers";
import { configureExpectedInputHandler } from "./utils/expectedInputHandler";
import { expectedInputHelperFunctions, expectedAnythingDispatchable, doAttack, doObserve } from "./utils/expectedInputHelperFunctions";
import { firstWordOf, firstElementIsEmpty } from "./utils/helperFunctions";
import Rx from 'rx';
import _ from "lodash";
import R from "ramda";
runPolyfills();

const runAttempt = R.curry((attemptType, inventory, attemptTypes, actions, messageGen, input) => {
		const getRequestedItem = readInputAndCreateDispatchable(inventory, attemptTypes, attemptType, actions, messageGen);
		const dispatchable = getRequestedItem(input);
		return dispatchable;
});

function lookAround(playerPos, map) {
	return (dispatch)=> {
		if (map[playerPos.y][playerPos.x].encounter) {
			let encounter = NPCs.all[map[playerPos.y][playerPos.x].encounter.id];
			dispatch(actions.showMessage(messageGen.getEncounterMessage(encounter), 0));
		}

		dispatch(actions.showMessage(messageGen.getLookAroundMessage(playerPos, map), 0));
	};
};

export default (input, expectedInput, prevInput, playerPos, player, map, dispatch) => {
	const submitObservable = Rx.Observable.create(observer => {
		observer.onNext(input);
	});

	const encounter = map[playerPos.y][playerPos.x] ? map[playerPos.y][playerPos.x].encounter : {};
	const NPC = encounter ? NPCs.all[encounter.id] : {hostile: false};
	const { EQUIP, LOOK_AT, LOOK_AROUND, RESET, TALK, EXPECTING_MOVEMENT, EXPECTING_BATTLE, ATTACK, OBSERVE } = constants;
	const generateDispatchableFor = generateDispatchable(constants, actions, messageGen, player,
		playerPos, map, encounter, NPC);
	const attack = doAttack(algorithms, constants, dispatch, actions, messageGen, NPCs, encounter);
	const observe = doObserve(dispatch, actions, messageGen, NPCs);

	const attemptEquip = runAttempt(attemptTypes.equip, player.inventory, attemptTypes, actions, messageGen);
	const attemptLookAt = runAttempt(attemptTypes.lookAt, player.inventory, attemptTypes, actions, messageGen);

	// Define needed predicate functions that eventually will run in a filter.
	// TODO: Extract these and create different kind of filters sending in all required data and predicates,
	// the filters are then applied by obseveCommand.
	const equipPredicate = string => firstWordOf(string).toUpperCase() === EQUIP && !R.isEmpty(player.inventory);
	const lookAtPredicate = string => string.toUpperCase().includes(LOOK_AT) && !R.isEmpty(player.inventory);
	const lookAroundPredicate = string => string.toUpperCase()
		.includes(LOOK_AROUND) && expectedInput === EXPECTING_MOVEMENT;
	const resetPredicate = string => firstWordOf(string).toUpperCase() === RESET;
	const talkPredicate = string => string.toUpperCase().includes(TALK) && !NPC.hostile;
	const attackPredicate = string => string.toUpperCase().includes(ATTACK);
	const observePredicate = string => string.toUpperCase().includes(OBSERVE);

	const observeEquip = observeCommand(EQUIP, attemptEquip, equipPredicate, generateDispatchableFor);
	const observeLookAt = observeCommand(EQUIP, attemptLookAt, lookAtPredicate, generateDispatchableFor);
	const observeLookAround = observeCommand(LOOK_AROUND, lookAround, lookAroundPredicate, generateDispatchableFor);
	const observeReset = observeCommand(RESET, actions.setInputExpected, resetPredicate, generateDispatchableFor);

	const observeTalk = observeCommand(TALK, actions.showMessage, talkPredicate, generateDispatchableFor);
	const observeAttack = observeCommand(ATTACK, attack, attackPredicate, generateDispatchableFor);
	const observeObservations = observeCommand(OBSERVE, observe, observePredicate, generateDispatchableFor);

	const encounterObservable = R.filter((_) => {
		return !firstElementIsEmpty(map) &&
				expectedInput !== EXPECTING_BATTLE &&
				encounter;
	}, submitObservable);

	// Command streams
	const equipStream = observeEquip(submitObservable);
	const lookAtStream = observeLookAt(submitObservable);
	const resetStream = observeReset(submitObservable);
	const lookAroundStream = observeLookAround(submitObservable);

	// Encounter command streams
	const talkStream = observeTalk(encounterObservable);
	const attackStream = observeAttack(encounterObservable);
	const observeStream = observeObservations(encounterObservable);

	// Omit the subscribe here and return the merged streams to playerbar.js, subscribe over there and dispatch.
	let dispatchableStream = Rx.Observable
		.merge(equipStream, lookAtStream, resetStream, lookAroundStream, talkStream, attackStream, observeStream);

	dispatchableStream
		.subscribe(dispatchable => dispatch(dispatchable));

	const handleExpectedInput = configureExpectedInputHandler(
		expectedInputHelperFunctions.checkAndSetName(input, constants, dispatch, actions),
		expectedInputHelperFunctions.checkAndSelectRace(Classes, player.name, input, expectedInput, constants, dispatch, actions),
		expectedInputHelperFunctions.checkAndSelectStarterWeapon(Weapons, input, expectedInput, constants, dispatch, actions, player),
		expectedInputHelperFunctions.checkAndValidateConfirmation(Classes, Weapons, input, prevInput, constants, dispatch, actions, player),
		expectedInputHelperFunctions.checkAndMovePlayer(algorithms, input, constants, playerPos, map, dispatch, actions, NPCs, player),
		expectedInputHelperFunctions.checkAndPerformBattleAction(algorithms, input, constants, dispatch, actions, NPCs, encounter, player),
		expectedAnythingDispatchable(MapGen, Items, constants, dispatch, actions)
	);
	return handleExpectedInput(dispatch, messageGen, expectedInput);
};
