import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

const SubmissionListView: React.FC<RouteComponentProps> = (props) => {
    const problemID = (props.match.params as { id?: string }).id;
    return <div></div>;
};


export default withRouter(SubmissionListView);
