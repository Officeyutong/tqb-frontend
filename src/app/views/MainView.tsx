import React from "react";
import { connect } from "react-redux";
import { StateType } from "../states/Manager";
import {
    Segment,
    Button,
    Grid,
    Icon,
    SemanticICONS,
    Header,
    Image,
    Divider,
} from "semantic-ui-react";
import {
    useDocumentTitle,
} from "../common/Utils";

import "./gnaq-button.css";

import { axiosObj as axios, DEBUG_MODE } from "../App";
import { Link } from "react-router-dom";
import GraphView from "./GraphView";
import AlipayDonationImage from "../../assets/donation/alipay.png";
import WechatDonationImage from "../../assets/donation/wechat.png";

const GNAQButton: React.FC<{ iconName: SemanticICONS; url: string; text: string }> = ({ iconName, text, url }) => {
    return <Link to={url} style={{ color: "#1b1c1d" }}>
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
    useDocumentTitle("主页");
    const debugReset = async () => {
        await axios.put("/user/refresh");
        window.location.reload();
    };
    return <div>
        {DEBUG_MODE && <Segment>
            <Button onClick={() => debugReset()}>
                重置数据
            </Button>
        </Segment>}
        {props.state.userState.login && <GraphView></GraphView>}
        <Grid columns="2">
            <Grid.Column>
                <Segment stacked>
                    <Header as="h1">
                        菜单
                            </Header>
                    <Grid columns="4">
                        {([
                            (props.state.userState.login) && { iconName: "play", url: "/game/subject", text: "开始" },
                            (props.state.userState.login) && { iconName: "signal", url: "/ranklist", text: "排行榜" },
                            (props.state.userState.login) && { iconName: "tasks", url: "/game/submission", text: "查看提交" },
                            { iconName: "help circle", url: "/doc/tqb", text: "第一届简介" },
                            { iconName: "help circle", url: "/doc/tqb-2nd", text: "第二届简介" },
                            { iconName: "address book", url: "/doc/staff", text: "Staff简介" },
                            { iconName: "archive", url: "/doc/scene", text: "剧情简介" },
                            (props.state.userState.userData.is_all_unlocked && { iconName: "recycle", url: "/godmode/list", text: "所有题目与剧情" })
                        ] as Array<{ iconName: SemanticICONS; url: string; text: string; }>).map(item => item && <Grid.Column key={item.url}>
                            <GNAQButton {...item}></GNAQButton>
                        </Grid.Column>)}
                    </Grid>
                </Segment>
            </Grid.Column>
            <Grid.Column>
                <Segment stacked>
                    <Header as="h1">
                        捐助
                    </Header>
                    <Divider></Divider>
                    <Grid columns="2">
                        <Grid.Column >
                            <Header as="h2">
                                支付宝
                            </Header>
                            <Image centered size="small" src={AlipayDonationImage}></Image>
                        </Grid.Column>
                        <Grid.Column >
                            <Header as="h2">
                                微信
                            </Header>
                            <Image centered size="small" src={WechatDonationImage}></Image>
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Grid.Column>
        </Grid>
    </div>
};

export default connect((state: StateType) => ({ state: state }))(MainView);
