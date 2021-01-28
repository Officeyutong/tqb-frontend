import React from "react";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import ProblemView from "./ProblemView";
import ScenePlayView from "./ScenePlayView";
import SubjectChooseView from "./SubjectChooseView";
import NextSceneChooseView from "./NextSceneChooseView";
import SubmissionListView from "./SubmissionListView";
const GameRoute = withRouter(((props) => {

    return <>
        <Route exact path={`${props.match.path}/subject`} component={SubjectChooseView} />
        <Route exact path={`${props.match.path}/question/:id`} component={ProblemView} />
        <Route exact path={`${props.match.path}/scene/:id`} component={ScenePlayView} />
        <Route exact path={`${props.match.path}/choose_scene/:problemID`} component={NextSceneChooseView} />
        <Route exact path={`${props.match.path}/submission/:id?`} component={SubmissionListView} />

    </>;

}) as React.FC<RouteComponentProps>);

export default GameRoute;

