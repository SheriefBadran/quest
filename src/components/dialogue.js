var React = require("react"),
	proptypes = React.PropTypes,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

var Dialogue = React.createClass({
	displayName: "Dialogue",
	propTypes: {
		speaker: proptypes.string.isRequired,
		line: proptypes.string.isRequired
	},
	render: function() {
		var name = this.props.speaker;
		if (name === "Player") {
			// Actually get the player's name
			name = "You!"
		}

		return (
			<Row className={this.props.speaker}>
				<Col xs={4} md={1}>
					{name+":"}
				</Col>
				<Col xs={12} md={11}>
					{this.props.line}
				</Col>
			</Row>
		);
	}
});

module.exports = Dialogue;