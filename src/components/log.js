var React = require("react"),
	ReactDOM = require("react-dom"),
	Panel = require("react-bootstrap").Panel,
	Input = require("react-bootstrap").Input,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col,
	Dialogue = require("./dialogue");

var Log = React.createClass({
	displayName: "Log",
	componentDidMount: function() {
 		var node = ReactDOM.findDOMNode(this.logpanel);
		node.scrollTop = node.scrollHeight;
	},
	componentDidUpdate: function() {
 		var node = ReactDOM.findDOMNode(this.logpanel);
		node.scrollTop = node.scrollHeight;
	},
	render: function() {

		var testLine = "Insert long expositionary line";

		return (
			<Panel className="log-box" ref={(ref) => this.logpanel = ref} >
				<Grid fluid>
					<Dialogue speaker="Wizard" line={testLine} />
					<Dialogue speaker="Player" line="Ohohohohoho" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
					<Dialogue speaker="Narrator" line="What will you do?" />
				</Grid>
			</Panel>
		);
	}
});

module.exports = Log;