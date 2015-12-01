var React = require("react"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	constants = require("../constants"),
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

var WorldMap = React.createClass({
	render: function() {
		if (this.props.display) {

			var rows = [];

			var minX = (this.props.player.x - (constants.VISUAL_MAP_WIDTH) > 0) ? this.props.player.x - (constants.VISUAL_MAP_WIDTH) : 0;
			var maxX = (this.props.player.x + (constants.VISUAL_MAP_WIDTH) < this.props.map[0].length-1) ? this.props.player.x + (constants.VISUAL_MAP_WIDTH) : this.props.map[0].length-1;
			var minY = (this.props.player.y - (constants.VISUAL_MAP_WIDTH) > 0) ? this.props.player.y - (constants.VISUAL_MAP_WIDTH) : 0;
			var maxY = (this.props.player.y + (constants.VISUAL_MAP_WIDTH) < this.props.map.length-1) ? this.props.player.y + (constants.VISUAL_MAP_WIDTH) : this.props.map.length-1;

			// Keep the map from being offset weirdly if there aren't enough rows
			if (minY === 0) {
				var missingRows = (constants.VISUAL_MAP_WIDTH*2) - maxY;
				for (var y = 0; y < missingRows; ++y) {
					var mapRow = [];
					for (var x = 0; x < (constants.VISUAL_MAP_WIDTH*2)+1; ++x) {
						mapRow.push(<font key={x + "" + y}>&nbsp;</font>);
					}
					rows.push(<p key={maxY + y + 1}>{mapRow}</p>);
				}
			}

			// Keep the map from being offset weirdly if there aren't enough columns to the left
			var leftOffset = 0;
			if (minX === 0) {
				leftOffset = (constants.VISUAL_MAP_WIDTH*2) - maxX;
			}

			// Keep the map from being offset weirdly if there aren't enough columns to the right
			var rightOffset = 0;
			if (maxX === this.props.map[0].length-1) {
				rightOffset = (constants.VISUAL_MAP_WIDTH*2) - (maxX - minX);
			}

			for (var y = minY; y <= maxY; ++y) {
				var mapRow = [];
				for (var x = minX - leftOffset; x <= maxX + rightOffset; ++x) {
					if (x < 0 || x >= this.props.map[0].length) {
						mapRow.push(<font key={x + "" + y}>&nbsp;</font>);
						continue;
					}
					if (x === this.props.player.x && y === this.props.player.y) {
						// Place the player character
						mapRow.push(<font key={x + "" + y} className="Player">☺</font>);
						continue;
					}
					if (!this.props.map[y][x].seen) { // If the area has not been seen it should be hidden
						mapRow.push(<font key={x + "" + y}>&nbsp;</font>);
						continue;
					}
					switch (this.props.map[y][x].type) { // TODO: remove this switch statement and just use a map to get symbols with type as key
						case "grasslands":
							mapRow.push(<font key={x + "" + y} className="grass">#</font>);
							break;
						case "Mountain":
							mapRow.push(<font key={x + "" + y} className="cliff">▲</font>);
							break;
						case "Water":
							mapRow.push(<font key={x + "" + y} className="water">♒</font>);
							break;
						case "Wizard":
							mapRow.push(<font key={x + "" + y} className="Wizard">Π</font>);
							break;
						default:
							console.log("Something went wrong in map drawing.");
							break;
					}
				}
				rows.push(<p key={y}>{mapRow}</p>);
			}

			return (
				<Panel className="map">
					{rows}
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
	return { display: state.world.displayMap, map: state.world.map, player: state.world.playerPos };
};

module.exports = ReactRedux.connect(mapStateToProps)(WorldMap);