var React = require("react"),
	ReactDOM = require("react-dom"),
	Panel = require("react-bootstrap").Panel,
	Input = require("react-bootstrap").Input,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col,
	Dialogue = require("./dialogue"),
	Log = require("./log");

var Quest = React.createClass({
	displayName: "Quest",
	componentDidMount: function() {
 		this.input.getInputDOMNode().focus();
	},
	render: function() {
		return (
			<div>
			<Log />
			<Input type="text" placeholder="Type here!" ref={(ref) => this.input = ref} />
			</div>
		);
	}
});

module.exports = Quest;