/*
Redux Store
*/

import { combineReducers, applyMiddleware, createStore } from "redux";
import initialState from "./initialstate";
import savedstate from "./savedstate";
import messageReducer from "./reducers/messageReducer";
import playerReducer from "./reducers/playerReducer";
import inputReducer from "./reducers/inputReducer";
import worldReducer from "./reducers/worldReducer";
import thunk from "redux-thunk";

let rootReducer = combineReducers({
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

module.exports = applyMiddleware(thunk, saveLocal)(createStore)(rootReducer, savedstate() || initialState());

