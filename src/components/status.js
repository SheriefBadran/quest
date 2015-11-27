var React = require("react"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Col = require("react-bootstrap").Col;

var Status = React.createClass({
	displayName: "Status",
	propTypes: {
		name: proptypes.string.isRequired,
		display: proptypes.bool.isRequired,
		stats: proptypes.object.isRequired
	},
	render: function() {
		if (this.props.display) {

			var str = this.props.stats.str;
			var mag = this.props.stats.mag;
			var dex = this.props.stats.dex;
			var def = this.props.stats.def;

			if (this.props.weapon) {
				str += this.props.weapon.stats.str;
				mag += this.props.weapon.stats.mag;
				dex += this.props.weapon.stats.dex;
				def += this.props.weapon.stats.def;
			}

			if (this.props.armour) {
				str += this.props.armour.stats.str;
				mag += this.props.armour.stats.mag;
				dex += this.props.armour.stats.dex;
				def += this.props.armour.stats.def;
			}

			return (
				<Panel className="status-window">
					<Grid fluid>
						<Col xs={2} md={1}>
							Name:<br />
							Race:
						</Col>
						<Col xs={2} md={2}>
							{this.props.name}<br />
							<font className={this.props.stats.race}>{this.props.stats.race}</font>
						</Col>
						<Col xs={2} md={1}>
							HP:<br />
							MP:
						</Col>
						<Col xs={2} md={2}>
							{this.props.stats.currenthp}/{this.props.stats.hp}<br />
							{this.props.stats.currentmp}/{this.props.stats.mp}
						</Col>
						<Col xs={2} md={2}>
							Strength:<br />
							Magic:
						</Col>
						<Col xs={2} md={1}>
							{str}<br />
							{mag}
						</Col>
						<Col xs={2} md={2}>
							Dexterity:<br />
							Defence:
						</Col>
						<Col xs={2} md={1}>
							{dex}<br />
							{def}
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
	return { name: state.player.name, display: state.player.displayStats, stats: state.player.stats, weapon: state.player.weapon, armour: state.player.armour };
};

module.exports = ReactRedux.connect(mapStateToProps)(Status);