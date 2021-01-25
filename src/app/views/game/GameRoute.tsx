import React from "react";
import { Switch, Route, RouteComponentProps, withRouter } from "react-router-dom";
import ProblemView from "./ProblemView";
const GameRoute = withRouter(((props) => {

    return <>
        <Route exact path={`${props.match.path}/problem/:id`} component={ProblemView}></Route>
    </>;
}) as React.FC<RouteComponentProps>);

export default GameRoute;

