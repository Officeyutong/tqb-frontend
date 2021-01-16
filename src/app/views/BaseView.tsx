import React from "react";
import { connect } from "react-redux";
import { StateType } from "../states/Manager";
import { Link } from "react-router-dom";
import {
    Menu,
    Icon,
    Container
} from "semantic-ui-react";
import axios from "axios";
import { showDialog } from "../dialogs/Dialog";
type BaseViewStateType = {
    state: StateType;
};
const BaseView: React.FC<BaseViewStateType> = (props) => {
    const { state, children } = props;
    const logout = async () => {
        let resp = (await axios.post("/api/user/logout")).data as { code: number; message?: string; };
        if (resp.code) {
            showDialog(resp.message, "错误", true);
            return;

        } else {
            window.location.reload();
        }
    };
    return <Container fluid style={{
        
    }}>
        <Menu attached="top" icon fluid>
            <Menu.Item as={Link} to="/">
                <Icon name="home"></Icon>
                主页
            </Menu.Item>
            
            <Menu.Item as={Link} to={`/profile/${state.userState.userData.uid}`}>
                {`您已登录为 ${state.userState.userData.username} (${state.userState.userData.displayname})`}
            </Menu.Item>
            <Menu.Item onClick={() => logout()}>
                登出
            </Menu.Item>
        </Menu>
        <div style={{ marginTop: "30px" }}>
            {children}
        </div>
        <Container textAlign="center" >
            <div style={{ color: "darkgray", marginTop: "50px", marginBottom: "50px" }}>
                By MikuNotFoundException
            </div>
        </Container>
    </Container>
    // return <div style={{ marginTop: 0, maxWidth: "70%" }}>

    // </div>;
};


export default connect((state) => ({
    state: state
} as BaseViewStateType))(BaseView);