/*
Redux Store
*/

var Redux = require("redux"),
	initialState = require("./initialstate"),
	messageReducer = require("./reducers/messageReducer"),
	playerReducer = require("./reducers/playerReducer"),
	inputReducer = require("./reducers/inputReducer")
	thunk = require("redux-thunk"); // for asynch actions

var rootReducer = Redux.combineReducers({
	log: messageReducer,
	player: playerReducer,
	input: inputReducer
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer,initialState());

