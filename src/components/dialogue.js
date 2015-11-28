var React = require("react"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

var Dialogue = React.createClass({
	displayName: "Dialogue",
	propTypes: {
		speaker: proptypes.string.isRequired,
		line: proptypes.array.isRequired,
		name: proptypes.string.isRequired
	},
	render: function() {
		var name = this.props.speaker + ":";
		if (name === "Player:") {
			name = this.props.name + ":";
		} else if (name === "Narrator:") {
			name = "";
		}

		var line = [];

		this.props.line.forEach(function(part, id) {
			line.push(<span key={id} className={part.className}>{part.text}</span>);
		}.bind(this));

		return (
			<Row className={this.props.speaker}>
				<Col xs={4} md={1}>
					{name}
				</Col>
				<Col xs={12} md={11}>
					<p>{line}</p>
				</Col>
			</Row>
		);
	}
});

var mapStateToProps = function (state) {
	return { name: state.player.name };
};

module.exports = ReactRedux.connect(mapStateToProps)(Dialogue);