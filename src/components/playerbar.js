import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import constants from "./../constants";
import { Input } from "react-bootstrap";
import inputvalidation from "./../inputvalidation";

let proptypes = React.PropTypes;

let PlayerBar = React.createClass({
	displayName: "PlayerBar",
	propTypes: {
		input: proptypes.string.isRequired,
		player: proptypes.object.isRequired,
		prevInput: proptypes.string.isRequired
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
				this.props.validateInput(this.state.text, this.props.input, this.props.prevInput, this.props.playerPos, this.props.player, this.props.map);
				this.setState({ text: "" });
			}
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
	return { input: state.input.awaiting, prevInput: state.input.previous, player: state.player, map: state.world.map,
				playerPos: state.world.playerPos };
};

let mapDispatchToProps = (dispatch)=> {
	return {
		validateInput(input, expectedInput, prevInput, playerPos, player, map) {
			dispatch(inputvalidation(input, expectedInput, prevInput, playerPos, player, map, dispatch));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerBar);
