import React, { useState } from "react";
import {
    Container,
    Header,
    Segment,
    Button,
    Form,
    Grid
} from "semantic-ui-react";
import { show as showDialog } from "../../dialogs/Dialog";
import { useDocumentTitle } from "../../common/Utils";
import { user } from "../../service/User";
const LoginView: React.FC<{}> = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    useDocumentTitle("登录");
    const submit = async () => {
        if (email.length === 0 || password.length === 0) {
            showDialog("请输入用户名和密码", "错误", true);
            return;
        }
        try {
            setLoading(true);
            await user.login(email, password);
            window.location.href = "/";
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }

    };
    return <div>

        <Container >
            <Grid columns="3">
                <Grid.Column></Grid.Column>
                <Grid.Column>
                    <Header as="h1">
                        登录
                    </Header>
                    <Segment stacked={true}>
                        <Form as="div">
                            <Form.Input label="电子邮箱" onChange={e => setEmail(e.target.value)} value={email}></Form.Input>
                            <Form.Input label="密码" onChange={e => setPassword(e.target.value)} value={password} type="password"></Form.Input>
                            <Button loading={loading} as="div" color="blue" onClick={submit}>提交</Button>
                        </Form>
                    </Segment>
                </Grid.Column>
                <Grid.Column></Grid.Column>
            </Grid>
        </Container>
    </div>;
}

export default LoginView;