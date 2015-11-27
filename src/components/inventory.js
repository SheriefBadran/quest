var React = require("react"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

var Inventory = React.createClass({
	displayName: "Inventory",
	propTypes: {
		display: proptypes.bool.isRequired,
		inventory: proptypes.array.isRequired
	},
	render: function() {
		if (this.props.display) {
			var col1 = [];
			var col2 = [];
			var col3 = [];
			var col4 = [];

			for (var i = 0; i < this.props.inventory.length; ++i) {
				// TODO improve the way this works a lot since it will be horrible for more than 20 items
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

			var weapon = "Nothing";
			if (this.props.weapon) {
				weapon = this.props.weapon.name;
			}

			var armour = "Nothing";
			if (this.props.armour) {
				armour = this.props.armour.name;
			}

			return (
				<Panel className="inventory-window">
					<Grid fluid>
						<Row>
						<Col xs={9} md={6}>
							Weapon: { weapon }
						</Col>
						<Col xs={9} md={6}>
							Armour: { armour }
						</Col>
						</Row>
						<Row className="inventory-title">
						<Col xs={18} md={12}>
							Inventory
						</Col>
						</Row>
						<Row>
						<Col xs={4.5} md={3}>
							{col1}
						</Col>
						<Col xs={4.5} md={3}>
							{col2}
						</Col>
						<Col xs={4.5} md={3}>
							{col3}
						</Col>
						<Col xs={4.5} md={3}>
							{col4}
						</Col>
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

var mapStateToProps = function (state) {
	return { display: state.player.displayInventory, inventory: state.player.inventory, weapon: state.player.weapon, armour: state.player.armour };
};

module.exports = ReactRedux.connect(mapStateToProps)(Inventory);