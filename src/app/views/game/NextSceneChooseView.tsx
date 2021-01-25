import React from "react";

import { withRouter, RouteComponentProps } from "react-router-dom";


const NextSceneChooseView: React.FC<RouteComponentProps> = (props) => {
    const problemID = (props.match.params as { problemID: string }).problemID;
    return <div></div>;
}

export default withRouter(NextSceneChooseView);