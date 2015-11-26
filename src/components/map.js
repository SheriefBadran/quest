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

			for (var x = 0; x < this.props.map.length; ++x) {
				var mapRow = [];
				for (var y = 0; y < this.props.map[x].length; ++y) {
					switch (this.props.map[x][y].type) {
						case "Grass":
							mapRow.push(<font key={x + "" + y} className="grass">#</font>);
							break;
						case "Mountain":
							mapRow.push(<font key={x + "" + y} className="cliff">V</font>);
							break;
						default:
							console.log("Something went wrong in map drawing.");
							break;
					}
				}
				rows.push(<p key={x}>{mapRow}</p>);
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
	return { display: state.world.displayMap, map: state.world.map };
};

module.exports = ReactRedux.connect(mapStateToProps)(WorldMap);