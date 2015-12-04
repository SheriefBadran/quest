import initialState from "./../initialstate";
import constants from "./../constants";

module.exports = (state, action)=> {
	let newState = Object.assign({}, state); // Copy to a new state so we don't screw up the old one
	switch (action.type) {
		case constants.QUEUE_MESSAGE: // Queue a message for showing
			newState.queue = [...newState.queue, action.message ];
			return newState;
		case constants.SHOW_MESSAGE: // Take the message from the queue and show it
			let item = newState.queue.shift();
			newState.messages = [...newState.messages, item ];
			return newState;
		case constants.RESET:
			return initialState().log;
		default:
			return state || initialState().log;
	}
};