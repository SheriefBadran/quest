var React = require("react"),
	ReactDOM = require("react-dom"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col,
	Dialogue = require("./dialogue");

var Status = React.createClass({
	displayName: "Status",
	propTypes: {
		name: proptypes.string.isRequired,
		display: proptypes.bool.isRequired,
		stats: proptypes.object.isRequired
	},
	render: function() {
		if (this.props.display) {
			return (
				<Panel className="status-window">
					<Grid fluid>
						<Col xs={1.5} md={1}>
							Name:<br />
							Race:
						</Col>
						<Col xs={3} md={2}>
							{this.props.name}<br />
							<font className={this.props.stats.race}>{this.props.stats.race}</font>
						</Col>
						<Col xs={1.5} md={1}>
							HP:<br />
							MP:
						</Col>
						<Col xs={3} md={2}>
							{this.props.stats.currenthp}/{this.props.stats.hp}<br />
							{this.props.stats.currentmp}/{this.props.stats.mp}
						</Col>
						<Col xs={1.5} md={1}>
							Strength:<br />
							Magic:
						</Col>
						<Col xs={3} md={2}>
							{this.props.stats.str}<br />
							{this.props.stats.mag}
						</Col>
						<Col xs={1.5} md={1}>
							Dexterity:<br />
							Defence:
						</Col>
						<Col xs={3} md={2}>
							{this.props.stats.dex}<br />
							{this.props.stats.def}
						</Col>
					</Grid>
				</Panel>
			);
		} else {
			return (
				<div></div>
			);
		}
	}
});

var mapStateToProps = function (state) {
	return { name: state.player.name, display: state.player.display, stats: state.player.stats };
};

module.exports = ReactRedux.connect(mapStateToProps)(Status);