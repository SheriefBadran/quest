import React from "react";
import Log from "./log";
import PlayerBar from "./playerbar";
import Status from "./status";
import Inventory from "./inventory";
import WorldMap from "./map";
import { Grid, Row, Col } from "react-bootstrap";

let Quest = (props)=> {
	return (
		<Grid fluid>
			<Row>
				<Col md={6} mdOffset={3}>
					<Status />
				</Col>
			</Row>
			<Row>
				<Col md={6} mdOffset={3}>
					<Log />
				</Col>
				<Col md={3}>
					<WorldMap />
				</Col>
			</Row>
			<Row>
				<Col md={6} mdOffset={3}>
					<PlayerBar />
				</Col>
			</Row>
			<Row>
				<Col md={6} mdOffset={3}>
					<Inventory />
				</Col>
			</Row>
		</Grid>
	);
};

export default Quest;