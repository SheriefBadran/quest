import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import actions from "./../actions";
import { Row, Col, Button } from "react-bootstrap";

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

export default connect(null, mapDispatchToProps)(EmergencyReset);