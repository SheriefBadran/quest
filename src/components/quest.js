var React = require("react"),
	Log = require("./log"),
	PlayerBar = require("./playerbar"),
	Status = require("./status");

var Quest = React.createClass({
	displayName: "Quest",
	render: function() {
		return (
			<div>
			<Status />
			<Log />
			<PlayerBar />
			</div>
		); // Probably should move the Input to its own component
	}
});

module.exports = Quest;