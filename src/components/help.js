import React from "react";
import { Panel, Grid, Row, Col } from "react-bootstrap";
import HelpList from "./../data/helplist";
import EmergencyReset from "./emergencyreset";
import HelpItem from "./helpitem";

let Help = (props)=> {
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
};

module.exports = Help;