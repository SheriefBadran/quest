var React = require('react'),
    ReactRouter = require('react-router'),
    Route = ReactRouter.Route,
    IndexRoute = ReactRouter.IndexRoute,
    Wrap = require('./components/wrapper'),
    quest = require('./components/quest');

module.exports = (
    <Route path='/' component={Wrap}>
        <IndexRoute component={quest} />
    </Route>
);