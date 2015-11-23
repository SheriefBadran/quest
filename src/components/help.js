var React = require("react"),
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col,
	HelpList = require("./../data/helplist"),
	HelpItem = require("./helpitem");

var Help = React.createClass({
	displayName: "Help",
	render: function() {
		var rows = [];

		HelpList.forEach(function(item, id) {
			var desc = <p>{item.description}<br />ex: <font className="command-style">{item.example}</font></p>;
			rows.push(<HelpItem command={item.name} description={desc} key={id} />);
		}.bind(this));

		return (
			<Panel className="help-grid">
				<Grid fluid>
					<Row className="help-head">
						<Col xs={18} md={12}>
							Instructions
						</Col>
					</Row>
					<Row>
						<Col xs={18} md={12}>
							Probably some description here perhaps.
						</Col>
					</Row>
					<Row className="help-head">
						<Col xs={18} md={12}>
							Commands
						</Col>
					</Row>
					{rows}
				</Grid>
			</Panel>
		);
	}
});

module.exports = Help;