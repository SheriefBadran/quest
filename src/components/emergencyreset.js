let React = require("react"),
	ReactDOM = require("react-dom"),
	ReactRedux = require("react-redux"),
	actions = require("./../actions"),
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col,
	Button = require("react-bootstrap").Button;

let EmergencyReset = React.createClass({
	handleClick() {
		localStorage.removeItem("Quest");
		this.props.resetGame(0);
	},
	render() {
		return (
			<Row>
				<Col md={12} style={{ textAlign: "center", marginTop: 5 }}>
					Somehow manage to break everything? Never fear!<br />
					<Button bsSize="large" bsStyle="danger" onClick={this.handleClick} style={{marginTop: 10}}>Emergency Reset</Button>
				</Col>
			</Row>
		);
	}
});

let mapDispatchToProps = (dispatch)=> {
	return {
		resetGame(timeout) {
			dispatch(actions.resetGame(timeout));
		}
	}
};

module.exports = ReactRedux.connect(null, mapDispatchToProps)(EmergencyReset);