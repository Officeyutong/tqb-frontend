import React from "react";
import { connect } from "react-redux";
import { StateType } from "../states/Manager";
import {
    Segment,
    Input,
    Button
} from "semantic-ui-react";
import {
    useDocumentTitle,
    useInputValue
} from "../common/Utils";

import axios from "axios";
const MainView: React.FC<{ state: StateType }> = (props) => {
    // const { state } = props;
    useDocumentTitle("主页");
    const input = useInputValue("qwq");
    const ping = async (text: string) => {
        return (await axios.post("/echo", { text: text })).data;
    };
    return <Segment stacked>
        <Input {...input}></Input>
        <Button onClick={() => ping(input.value).then(s => console.log(s))}>
            发送
        </Button>
    </Segment>;
};

export default connect((state: StateType) => ({ state: state }))(MainView);
