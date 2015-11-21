var constants = require("./constants");

module.exports = {
	showMessage: function(message) {
		return { type: constants.SHOW_MESSAGE, message: message }
	},
	setName: function(name) {
		return { type: constants.SET_NAME, name: name }
	},
	setInputExpected: function(inputType) {
		return { type: constants.SET_INPUT, input: inputType }
	}
};