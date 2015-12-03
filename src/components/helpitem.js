// Help item class used by "help.js"

let React = require("react"),
	proptypes = React.PropTypes,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

let HelpItem = (props)=> {
	return (
		<Row className="help-row">
			<Col className="help-command" md={6}><span className="command-style">{props.command}</span></Col>
			<Col md={6}>{props.description}</Col>
		</Row>
	);
};

HelpItem.propTypes = {
	command: proptypes.string.isRequired,
	description: proptypes.object.isRequired
};

module.exports = HelpItem;