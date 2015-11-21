var constants = require("./constants");

module.exports = {
	showMessage: function(message, timeout) {
		return function(dispatch) {
			setTimeout(function() {
				dispatch({ type: constants.SHOW_MESSAGE, message: message });
			}, timeout);
		}
	},
	setName: function(name) {
		return { type: constants.SET_NAME, name: name }
	},
	setInputExpected: function(inputType) {
		return { type: constants.SET_INPUT, input: inputType }
	}
};