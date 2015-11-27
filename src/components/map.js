var React = require("react"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

var WorldMap = React.createClass({
	render: function() {
		if (this.props.display) {

			var rows = [];

			for (var y = 0; y < this.props.map.length; ++y) {
				var mapRow = [];
				for (var x = 0; x < this.props.map[y].length; ++x) {
					if (x === this.props.player.x && y === this.props.player.y) {
						// Place the player character
						mapRow.push(<font key={x + "" + y} className="Player">☺</font>);
						continue;
					}
					if (!this.props.map[y][x].seen) { // If the area has not been seen it should be hidden
						mapRow.push(<font key={x + "" + y}>&nbsp;</font>);
						continue;
					}
					switch (this.props.map[y][x].type) { // TODO remove this switch statement and just use a map to get symbols with type as key
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