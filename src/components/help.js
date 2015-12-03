let React = require("react"),
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col,
	HelpList = require("./../data/helplist"),
	EmergencyReset = require("./emergencyreset"),
	HelpItem = require("./helpitem");

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
				<Col md={6} mdOffset={3}>
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

module.exports = Help;