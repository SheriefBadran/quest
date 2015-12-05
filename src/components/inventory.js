import React from "react";
import { connect } from "react-redux";
import { Panel, Grid, Row, Col } from "react-bootstrap";

let proptypes = React.PropTypes;

let Inventory = React.createClass({
	displayName: "Inventory",
	propTypes: {
		display: proptypes.bool.isRequired,
		inventory: proptypes.array.isRequired
	},
	render() {
		if (this.props.display) {

			let weapon = "Nothing";
			if (this.props.weapon) {
				weapon = this.props.weapon.name;
			}

			let armour = "Nothing";
			if (this.props.armour) {
				armour = this.props.armour.name;
			}
            
            var currentNumberOfColumns = 1,
                maximumNumberOfColumns = 4,
                preferredNumberOfItemsInEachColumn = 5,
                isLastColumn,
                columns = [],
                inventories = this.props.inventory.slice(0),
                inventoriesInColumn,
                wrapInventoryInPElement = function(inventory, index){
                  return <p key={index}>{inventory.name}</p>;
                };

            while(currentNumberOfColumns <= maximumNumberOfColumns){
                isLastColumn = currentNumberOfColumns === maximumNumberOfColumns;

                if(isLastColumn){
                    inventoriesInColumn = inventories.splice(0).map(wrapInventoryInPElement);
                }else{
                    inventoriesInColumn = inventories.splice(0, preferredNumberOfItemsInEachColumn).map(wrapInventoryInPElement);
                }
                
                columns.push(<Col key={currentNumberOfColumns} md={3} xs={4.5}>{inventoriesInColumn}</Col>);
                currentNumberOfColumns++;
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
				            {columns}
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

export default connect(mapStateToProps)(Inventory);