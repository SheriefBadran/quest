// Help item class used by "help.js"

import React from "react";
import { Row, Col } from "react-bootstrap";

let proptypes = React.PropTypes;

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