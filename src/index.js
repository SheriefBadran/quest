/*
This is the entry point for the app! From here we merely import our routes definitions,
then use React and React-DOM to render it.
*/

var React = require("react"),
    ReactRouter = require('react-router'),
    Router = ReactRouter.Router,
	ReactDOM = require("react-dom"),
	Provider = require("react-redux").Provider,
	store = require("./store"),
	routes = require('./routes');

ReactDOM.render(
	<Provider store={store}>
		<Router routes={routes}/>
	</Provider>,
  document.getElementById("root")
);