import React from "react";
import { connect } from "react-redux";
import { StateType } from "../states/Manager";
import { Link } from "react-router-dom";
import {
    Menu,
    Icon,
    Container
} from "semantic-ui-react";
import { user } from "../service/User";
type BaseViewStateType = {
    state: StateType;
};
const BaseView: React.FC<BaseViewStateType> = (props) => {
    const { state, children } = props;
    const logout = async () => {
        await user.logout();
    };
    return <Container fluid style={{

    }}>
        <Menu attached="top" icon fluid>
            <Menu.Item as={Link} to="/">
                <Icon name="home"></Icon>
                主页
            </Menu.Item>


            {state.userState.login ? <>
                <Menu.Item >
                    {`您已登录为 ${state.userState.userData.username} (${state.userState.userData.email})`}
                </Menu.Item>
                <Menu.Item onClick={() => logout()}>
                    登出
                    </Menu.Item>
            </> : <>
                    <Menu.Item as={Link} to="/login">
                        登录...
                    </Menu.Item>
                    <Menu.Item as={Link} to="/register">
                        注册...
                    </Menu.Item>
                    <Menu.Item as={Link} to="/reset_password">
                        重置密码...
                    </Menu.Item>

                </>}
        </Menu>
        <div style={{ marginTop: "30px" }}>
            {children}
        </div>
        <Container textAlign="center" >
            <div style={{ color: "darkgray", marginTop: "50px", marginBottom: "50px" }}>
                <div>By TQB DevTeam</div>
                <div><a href="https://github.com/Officeyutong/tqb-frontend">Frontend</a></div>
                <div><a href="https://github.com/KSkun/tqb-backend">Backend</a></div>
            </div>
        </Container>
    </Container>

};


export default connect((state) => ({
    state: state
} as BaseViewStateType))(BaseView);