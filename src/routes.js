import React from "react";
import { Route, IndexRoute } from "react-router";
import Wrap from "./components/wrapper";
import quest from "./components/quest";
import help from "./components/help";

export default (
    <Route component={Wrap} path="/">
        <IndexRoute component={quest} />
        <Route component={help} path="/help" />
    </Route>
);