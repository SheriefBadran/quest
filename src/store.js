/*
Redux Store
*/

var Redux = require("redux"),
	initialState = require("./initialstate"),
	messageReducer = require("./reducers/messageReducer"),
	playerReducer = require("./reducers/playerReducer"),
	inputReducer = require("./reducers/inputReducer"),
	worldReducer = require("./reducers/worldReducer"),
	thunk = require("redux-thunk"); // for asynch actions

var rootReducer = Redux.combineReducers({
	log: messageReducer,
	player: playerReducer,
	input: inputReducer,
	world: worldReducer
});

const saveLocal = store => next => action => {
	let result = next(action);
	localStorage.setItem("Quest", JSON.stringify(store.getState()));
  	return result;
};

const savedState = () => {
	return JSON.parse(localStorage.getItem("Quest"));
};

module.exports = Redux.applyMiddleware(thunk, saveLocal)(Redux.createStore)(rootReducer, savedState() || initialState());

