let React = require("react"),
	Log = require("./log"),
	PlayerBar = require("./playerbar"),
	Status = require("./status"),
	Inventory = require("./inventory"),
	WorldMap = require("./map"),
	Grid = require ("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

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

module.exports = Quest;