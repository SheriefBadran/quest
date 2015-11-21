var React = require("react"),
	Log = require("./log"),
	PlayerBar = require("./playerbar");

var Quest = React.createClass({
	displayName: "Quest",
	render: function() {
		return (
			<div>
			<Log />
			<PlayerBar />
			</div>
		); // Probably should move the Input to its own component
	}
});

module.exports = Quest;