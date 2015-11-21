var React = require("react"),
	ReactDOM = require("react-dom"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col,
	Dialogue = require("./dialogue");

var Log = React.createClass({
	displayName: "Log",
	propTypes: {
		name: proptypes.string.isRequired,
		messages: proptypes.array.isRequired
	},
	componentDidMount: function() {
 		var node = ReactDOM.findDOMNode(this.logpanel);
		node.scrollTop = node.scrollHeight;
	},
	componentDidUpdate: function() {
 		var node = ReactDOM.findDOMNode(this.logpanel);
		node.scrollTop = node.scrollHeight;
	},
	render: function() {
		var lines = [];

		this.props.messages.forEach(function(message, id) {
			var line = message.line.replace(/%NAME%/g, this.props.name);
			lines.push(<Dialogue speaker={message.speaker} line={line} key={id} />);
		}.bind(this));

		return (
			<Panel className="log-box" ref={(ref) => this.logpanel = ref} >
				<Grid fluid>
					{lines}
				</Grid>
			</Panel>
		);
	}
});

var mapStateToProps = function (state) {
	return { name: state.player.name, messages: state.log.messages };
};

module.exports = ReactRedux.connect(mapStateToProps)(Log);