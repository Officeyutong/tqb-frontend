import React from "react";
import { connect } from "react-redux";
import { StateType } from "../states/Manager";
import {
    Segment,
    Input,
    Button,
    Grid,
    Icon,
    SemanticICONS
} from "semantic-ui-react";
import {
    useDocumentTitle,
    useInputValue
} from "../common/Utils";

import "./gnaq-button.css";

import { axiosObj as axios } from "../App";
import { Link } from "react-router-dom";
const GNAQButton: React.FC<{ iconName: SemanticICONS; url: string; text: string }> = ({ iconName, text, url }) => {
    return <Link to={url}  style={{color:"#1b1c1d"}}>
        <div className="gnaq-main-button" style={{ cursor: "pointer" }}>
            <div className="gnaq-mn-btn-logo-hover">
                <div className="gnaq-mn-btn-logo">
                    <Icon aria-hidden="true" name={iconName as SemanticICONS}></Icon>
                </div>
            </div>

            <div className="gnaq-mn-btn-text-hover">
                <div className="gnaq-mn-btn-text">
                    {text}
                </div>
            </div>
        </div>
    </Link>
};

const MainView: React.FC<{ state: StateType }> = (props) => {
    // const { state } = props;
    useDocumentTitle("主页");
    const input = useInputValue("qwq");
    const ping = async (text: string) => {
        return (await axios.post("/echo", { text: text })).data;
    };
    return <Segment stacked>
        <Grid columns="2">
            <Grid.Column>
                <Grid columns="3">
                    {([
                        { iconName: "play", url: "/game/subject", text: "开始" },
                        { iconName: "signal", url: "/ranklist", text: "排行榜" },
                        { iconName: "help circle", url: "/doc/tqb", text: "退群杯简介" },
                        { iconName: "help circle", url: "/doc/tqb-2nd", text: "第二届退群杯简介" },
                        { iconName: "address book", url: "/doc/staff", text: "Staff简介" },
                        { iconName: "archive", url: "/doc/scene", text: "剧情简介" },


                    ] as Array<{ iconName: SemanticICONS; url: string; text: string; }>).map(item => <Grid.Column key={item.url}>
                        <GNAQButton {...item}></GNAQButton>
                    </Grid.Column>)}


                </Grid>
            </Grid.Column>
            <Grid.Column>
                <Input {...input}></Input>
                <Button onClick={() => ping(input.value).then(s => console.log(s))}>
                    发送
                </Button>
            </Grid.Column>
        </Grid>
    </Segment>;
};

export default connect((state: StateType) => ({ state: state }))(MainView);
