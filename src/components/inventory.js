let React = require("react"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

let Inventory = React.createClass({
	displayName: "Inventory",
	propTypes: {
		display: proptypes.bool.isRequired,
		inventory: proptypes.array.isRequired
	},
	render() {
		if (this.props.display) {
			let col1 = [];
			let col2 = [];
			let col3 = [];
			let col4 = [];

			for (let i = 0; i < this.props.inventory.length; ++i) {
				// TODO: improve the way this works a lot since it will be horrible for more than 20 items
				if (i < 5) {
					col1.push(<p key={i}>{this.props.inventory[i].name}</p>);
				} else if (i < 10) {
					col2.push(<p key={i}>{this.props.inventory[i].name}</p>);
				} else if (i < 15) {
					col3.push(<p key={i}>{this.props.inventory[i].name}</p>);
				} else {
					col4.push(<p key={i}>{this.props.inventory[i].name}</p>);
				}
			}

			let weapon = "Nothing";
			if (this.props.weapon) {
				weapon = this.props.weapon.name;
			}

			let armour = "Nothing";
			if (this.props.armour) {
				armour = this.props.armour.name;
			}

			return (
				<Panel className="inventory-window">
					<Grid fluid>
						<Row>
						<Col md={6} xs={9}>Weapon: {weapon}</Col>
						<Col md={6} xs={9}>Armour: {armour}</Col>
						</Row>
						<Row className="inventory-title">
						<Col md={12} xs={18}>Inventory</Col>
						</Row>
						<Row>
						<Col md={3} xs={4.5}>{col1}</Col>
						<Col md={3} xs={4.5}>{col2}</Col>
						<Col md={3} xs={4.5}>{col3}</Col>
						<Col md={3} xs={4.5}>{col4}</Col>
						</Row>
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
	return { display: state.player.displayInventory, inventory: state.player.inventory, weapon: state.player.weapon, armour: state.player.armour };
};

module.exports = ReactRedux.connect(mapStateToProps)(Inventory);