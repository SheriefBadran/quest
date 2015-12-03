let React = require("react"),
	ReactDOM = require("react-dom"),
	ReactRedux = require("react-redux"),
	proptypes = React.PropTypes,
	Panel = require("react-bootstrap").Panel,
	Grid = require("react-bootstrap").Grid,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col,
	Dialogue = require("./dialogue");

let Log = React.createClass({
	displayName: "Log",
	propTypes: {
		playername: proptypes.string.isRequired,
		messages: proptypes.array.isRequired
	},
	componentDidMount() {
 		let node = ReactDOM.findDOMNode(this.logpanel);
		node.scrollTop = node.scrollHeight;
	},
	componentDidUpdate() {
 		let node = ReactDOM.findDOMNode(this.logpanel);
		node.scrollTop = node.scrollHeight;
	},
	render() {
		let lines = this.props.messages.map((message, id)=> <Dialogue
			speaker={message.speaker}
			line={message.line}
			key={id}
			playername={this.props.playername}
		/>);
		return (
			<Panel className="log-box" ref={(ref) => this.logpanel = ref} >
				<Grid fluid>
					{lines}
				</Grid>
			</Panel>
		);
	}
});

let mapStateToProps = (state)=> {
	return { playername: state.player.name, messages: state.log.messages };
};

module.exports = ReactRedux.connect(mapStateToProps)(Log);