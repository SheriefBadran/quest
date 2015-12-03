let React = require("react"),
	proptypes = React.PropTypes,
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col,
	HelpList = require("./../data/helplist"),
	EmergencyReset = require("./emergencyreset");

let Help = React.createClass({
	displayName: "Help",
	render() {
		let rows = HelpList.map(
			(item, id)=> <HelpItem command={item.name} 
				description={<p>{item.description}<br />ex: <span className="command-style">{item.example}</span></p>} 
				key={id} />
		);

		return (
			<Grid fluid>
				<Col mdOffset={3} md={6}>
					<Panel className="help-grid">
						<Row className="help-head">
							<Col md={12}>Instructions</Col>
						</Row>
						<Row>
							<Col md={12}>Probably some description here perhaps.</Col>
						</Row>
						<Row className="help-head">
							<Col md={12}>Commands</Col>
						</Row>
						{rows}
						<EmergencyReset />
					</Panel>
				</Col>
			</Grid>
		);
	}
});

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

module.exports = Help;