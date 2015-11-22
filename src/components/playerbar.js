var React = require("react"),
	ReactDOM = require("react-dom"),
	ReactRedux = require("react-redux"),
	actions = require("./../actions"),
	constants = require("./../constants"),
	messageGen = require("./messagegen"),
	proptypes = React.PropTypes,
	Input = require("react-bootstrap").Input,
	Classes = require("./../data/class");

var PlayerBar = React.createClass({
	displayName: "PlayerBar",
	propTypes: {
		input: proptypes.string.isRequired,
		name: proptypes.string.isRequired,
		prevInput: proptypes.string.isRequired,
		showMessage: proptypes.func.isRequired,
		setName: proptypes.func.isRequired,
		setInputExpected: proptypes.func.isRequired,
		setStats: proptypes.func.isRequired,
		setDisplayStats: proptypes.func.isRequired
	},
	componentDidMount: function() {
 		this.input.getInputDOMNode().focus();
	},
	getInitialState: function() {
		return { text: "" };
	},
	handleChange: function(event) {
		this.setState({ text: event.target.value });
	},
	handleSubmit: function(event) {
		if (event.keyCode == 13) { // If it's enter key
			if (this.state.text) {
				this.validateAndSendInput(this.state.text);
				this.setState({ text: "" });
			}
		}
	},
	validateAndSendInput: function(input) {
		switch (this.props.input) {
			case constants.DISABLED:
				break; // Should not be doing anything
			case constants.EXPECTING_NAME:
				// Validate the length of the name
				var message;
				if (input.length > constants.MAX_NAME_LENGTH || input.length < constants.MIN_NAME_LENGTH) {
					message = { speaker: "Wizard", line: <p>Hmmm... are you sure about that? Around here, names are usually between {constants.MIN_NAME_LENGTH} and {constants.MAX_NAME_LENGTH} characters in length! How about trying again?</p> };
				} else {
					message = { speaker: "Wizard", line: <p>{input} you say? Weird name... are you sure about that?</p> };
					this.props.setName(input);
					this.props.setInputExpected(constants.EXPECTING_CONF);
				}
				this.props.showMessage({ speaker: "Player", line: <p>I'm {input}.</p> }, 0);
				this.props.showMessage(message, 1000); // Display the message
				break;
			case constants.EXPECTING_RACE:
				var playerMessage;
				var message;

				var raceOptions = [];

				for (var raceName in Classes) {
					if (Classes.hasOwnProperty(raceName)) {
						raceOptions.push(raceName);
					}
				}

				// Check if it's a valid race
				var valid = false;
				var chosenRace;
				for (var i = 0; i < raceOptions.length; ++i) {
					if (input.toUpperCase() === raceOptions[i].toUpperCase()) {
						valid = true;
						chosenRace = raceOptions[i];
						break;
					}
				}

				if (valid) {
					var prefix = ("AEIOU".indexOf(input.charAt(0).toUpperCase()) < 0) ? "A" : "An";
					playerMessage = { speaker: "Player", line: <p>I'm {prefix.toLowerCase()} {chosenRace}... I think?</p> };
					message = { speaker: "Wizard", line: <p>Aha! {prefix} <font className={chosenRace}>{chosenRace}</font> eh? {Classes[chosenRace].description} Are you sure about this?</p>};
					this.props.setStats(Classes[chosenRace].stats);
					this.props.setInputExpected(constants.EXPECTING_CONF);
				} else { // If it's not a valid race then we do a fail again
					playerMessage = messageGen.getPlayerFail();
					message = messageGen.getMultiChoiceFailMessage(this.props.input, raceOptions, this.props.name);
				}

				this.props.showMessage(playerMessage, 0);
				this.props.showMessage(message, 1000); // Display the message
				break;
			case constants.EXPECTING_CONF:
				var playerMessage;
				var message;
				if (input.toUpperCase() === "YES" || input.toUpperCase() === "Y") {
					playerMessage = messageGen.getPlayerYes();
					message = messageGen.getConfirmMessage(this.props.prevInput, this.props.name);
					switch (this.props.prevInput) {
						case constants.EXPECTING_NAME:
							this.props.showMessage(messageGen.getRaceMessage(this.props.name, Classes), 2000);
							this.props.setInputExpected(constants.EXPECTING_RACE);
							break;
						case constants.EXPECTING_RACE:
							this.props.showMessage({ speaker: "Narrator", line: <p>Your status has been updated!</p> }, 2000);
							this.props.setDisplayStats(true, 2000);

							// TODO move to next part, show next message, update player stats to be base stats of that race
							this.props.setInputExpected(constants.DISABLED);


							
							break;
						default:
							this.props.setInputExpected(constants.DISABLED);
							break;
					}
				} else if (input.toUpperCase() === "NO" || input.toUpperCase() === "N") {
					var options = [];

					if (this.props.prevInput === constants.EXPECTING_RACE) {
						options = Classes;
					}

					playerMessage = messageGen.getPlayerNo();
					message = messageGen.getDenyMessage(this.props.prevInput, this.props.name, options);
					this.props.setInputExpected(this.props.prevInput);
				} else {
					playerMessage = messageGen.getPlayerFail();
					message = messageGen.getFailMessage(this.props.prevInput, this.props.name);
				}
				this.props.showMessage(playerMessage, 0);
				this.props.showMessage(message, 1000); // Display the message
				break;
			default:
				break;;
		}
	},
	render: function() {
		return (
			<Input type="text" placeholder="Type here!" ref={(ref) => this.input = ref} disabled={this.props.input === constants.DISABLED}
				value={this.state.text} onChange={this.handleChange} onKeyDown={this.handleSubmit} />
		);
	}
});

var mapStateToProps = function (state) {
	return { input: state.input.awaiting, prevInput: state.input.previous, name: state.player.name };
};

var mapDispatchToProps = function (dispatch) {
	return {
		showMessage: function(message, timeout) {
			dispatch(actions.showMessage(message, timeout));
		},
		setName: function(name) {
			dispatch(actions.setName(name));
		},
		setStats: function(stats) {
			dispatch(actions.setStats(stats));
		},
		setInputExpected: function(inputType) {
			dispatch(actions.setInputExpected(inputType));
		},
		setDisplayStats: function(display, timeout) {
			dispatch(actions.setDisplayStats(display, timeout));
		}
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PlayerBar);