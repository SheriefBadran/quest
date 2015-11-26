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
			return (
				<Panel className="map">

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
	return { display: state.world.displayMap };
};

module.exports = ReactRedux.connect(mapStateToProps)(WorldMap);