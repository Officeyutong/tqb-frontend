import React, { useState, useEffect } from "react";
import { axiosObj as axios } from '../../App';
import { game } from "../../service/Game";
import { user } from "../../service/User";
import {
    converter
} from "../../common/Markdown";

import { withRouter, RouteComponentProps } from "react-router-dom";

const ProblemView: React.FC<RouteComponentProps> = (props) => {
    const problemID = (props.match.params as { id: string }).id;

    return <div></div>;
};


export default withRouter(ProblemView);