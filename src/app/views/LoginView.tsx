import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    Container,
    Header,
    Segment,
    Button,
    Form
} from "semantic-ui-react";
import { show as showDialog } from "../dialogs/Dialog";
const LoginView: React.FC<{}> = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        document.title = "登录"
    });
    const submit = async () => {
        if (username.length === 0 || password.length === 0) {
            showDialog("请输入用户名和密码", "错误", true);
            return;
        }
        setLoading(true);
        let result = (await axios.post("/api/user/login", {
            username: username,
            password: password
        })).data;
        setLoading(false);
        if (result.code) {
            showDialog(result.message, "错误", true);
            return;
        }
        window.location.href = "/";
    };
    return <div style={{ marginTop: "10%" }}>

        <Container >
            <Header as="h1">
                登录
            </Header>
            <Segment stacked={true} style={{ maxWidth: "40%" }}>
                <Form as="div">
                    <Form.Input label="用户名" onChange={e => setUsername(e.target.value)} value={username}></Form.Input>
                    <Form.Input label="密码" onChange={e => setPassword(e.target.value)} value={password} type="password"></Form.Input>
                    <Button loading={loading} as="div" color="green" onClick={submit}>提交</Button>
                </Form>
            </Segment>
        </Container>
    </div>;
}

export default LoginView;