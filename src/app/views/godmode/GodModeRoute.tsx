import React from "react";

import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import GodModeListView from "./GodModeListView";
import GodModeQuestionView from "./GodModeQuestionView";
import GodModeSceneView from "./GodModeSceneView";
const GodModeRoute = withRouter(((props) => {
    return <>
        <Route exact path={`${props.match.path}/list`} component={GodModeListView} />
        <Route exact path={`${props.match.path}/question/:id`} component={GodModeQuestionView} />
        <Route exact path={`${props.match.path}/scene/:id`} component={GodModeSceneView} />
    </>
}) as React.FC<RouteComponentProps>);


export default GodModeRoute;