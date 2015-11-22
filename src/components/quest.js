var React = require("react"),
	Log = require("./log"),
	PlayerBar = require("./playerbar"),
	Status = require("./status"),
	Inventory = require("./inventory");

var Quest = React.createClass({
	displayName: "Quest",
	render: function() {
		return (
			<div>
			<Status />
			<Log />
			<PlayerBar />
			<Inventory />
			</div>
		); // Probably should move the Input to its own component
	}
});

module.exports = Quest;