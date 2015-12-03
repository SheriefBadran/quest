// This component displays a single line in the game log window. Used in `log.js`.

let React = require("react"),
	proptypes = React.PropTypes,
	Row = require("react-bootstrap").Row,
	Col = require("react-bootstrap").Col;

let Dialogue = (props)=> {

	// Figure out what name to display, if any
	let displayname = 
		props.speaker === "Player" ? props.playername + ": "
		: props.speaker === "Narrator" ? ""
		: props.speaker + ": ";

	// Build the line out of the provided parts in order to allow for word-specific styling
	let line = props.line.map(
		(part,id)=> <span key={id} className={part.className}>{part.text}</span>
	);

	// Return a row with displayname and the built line
	return (
		<Row className={props.speaker}>
			<Col xs={4} md={1}>{displayname}</Col>
			<Col xs={12} md={11}><p>{line}</p></Col>
		</Row>
	);
};

Dialogue.propTypes = {
	speaker: proptypes.string.isRequired,
	line: proptypes.array.isRequired,
	playername: proptypes.string.isRequired
};

module.exports = Dialogue;