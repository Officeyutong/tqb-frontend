import React from "react";
import { Route, RouteComponentProps, withRouter, Redirect, RouteProps } from "react-router-dom";
import ProblemView from "./ProblemView";
import ScenePlayView from "./ScenePlayView";
import SubjectChooseView from "./SubjectChooseView";
import NextSceneChooseView from "./NextSceneChooseView";
import { game } from "../../service/Game";

const GameRoute = withRouter(((props) => {

    return <>
        <Route exact path={`${props.match.path}/subject`} component={SubjectChooseView} />
        <Route exact path={`${props.match.path}/problem/:id`} component={ProblemView} />
        <Route exact path={`${props.match.path}/scene/:id`} component={ScenePlayView} />
        <Route exact path={`${props.match.path}/choose_scene/:problemID`} component={NextSceneChooseView} />
        
    </>;

}) as React.FC<RouteComponentProps>);

export default GameRoute;

