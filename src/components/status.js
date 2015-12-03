let React = require("react"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Col = require("react-bootstrap").Col;

let Status = React.createClass({
	displayName: "Status",
	propTypes: {
		display: proptypes.bool.isRequired,
		name: proptypes.string.isRequired,
		stats: proptypes.object.isRequired
	},
	render() {
		if (this.props.display) {

			let str = this.props.stats.str;
			let mag = this.props.stats.mag;
			let dex = this.props.stats.dex;
			let def = this.props.stats.def;

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
						<Col md={1} xs={2}>
							Name:<br />
							Race:
						</Col>
						<Col md={2} xs={2}>
							{this.props.name}<br />
							<span className={this.props.stats.race}>{this.props.stats.race}</span>
						</Col>
						<Col md={1} xs={2}>
							HP:<br />
							MP:
						</Col>
						<Col md={2} xs={2}>
							{this.props.stats.currenthp}/{this.props.stats.hp}<br />
							{this.props.stats.currentmp}/{this.props.stats.mp}
						</Col>
						<Col md={2} xs={2}>
							Strength:<br />
							Magic:
						</Col>
						<Col md={1} xs={2}>
							{str}<br />
							{mag}
						</Col>
						<Col md={2} xs={2}>
							Dexterity:<br />
							Defence:
						</Col>
						<Col md={1} xs={2}>
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

let mapStateToProps = (state)=> {
	return { name: state.player.name, display: state.player.displayStats, stats: state.player.stats, weapon: state.player.weapon, armour: state.player.armour };
};

module.exports = ReactRedux.connect(mapStateToProps)(Status);