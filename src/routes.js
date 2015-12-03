let React = require("react"),
    ReactRouter = require("react-router"),
    Route = ReactRouter.Route,
    IndexRoute = ReactRouter.IndexRoute,
    Wrap = require("./components/wrapper"),
    quest = require("./components/quest"),
    help = require("./components/help");

module.exports = (
    <Route component={Wrap} path="/">
        <IndexRoute component={quest} />
        <Route component={help} path="/help" />
    </Route>
);