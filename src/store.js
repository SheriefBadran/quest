/*
Redux Store
*/

var Redux = require("redux"),
	initialState = require("./initialstate"),
	thunk = require("redux-thunk"); // for asynch actions

var rootReducer = Redux.combineReducers({
	//counter: counterReducer   // this means counterReducer will operate on appState.counter
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer,initialState());

