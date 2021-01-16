import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StateType } from "../states/Manager";
import {
    Segment,
    Image,
    Container
} from "semantic-ui-react";
const MainView: React.FC<{ state: StateType }> = (props) => {
    const { state } = props;
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (!loaded) {
            setLoaded(true);
            document.title = "主页";
        }
    }, [loaded]);
    return <Segment stacked>
        这里是主页.
    </Segment>;
};

export default connect((state: StateType) => ({ state: state }))(MainView);
