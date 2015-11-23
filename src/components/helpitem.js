var React = require("react"),
	proptypes = React.PropTypes,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

var HelpItem = React.createClass({
	displayName: "Help Item",
	propTypes: {
		command: proptypes.string.isRequired,
		description: proptypes.object.isRequired
	},
	render: function() {
		return (
				<Row className="help-row">
					<Col className="help-command" xs={9} md={6}>
						<font className="command-style">{this.props.command}</font>
					</Col>
					<Col xs={9} md={6}>
						{this.props.description}
					</Col>
				</Row>
		);
	}
});

module.exports = HelpItem;