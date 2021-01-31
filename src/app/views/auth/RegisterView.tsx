import React, { useState, useEffect } from "react";
import {
    useDocumentTitle,
    useInputValue
} from "../../common/Utils";
import {
    Segment,
    Form,
    Header,
    Container,
    Button,
    Grid
} from "semantic-ui-react";
import { showErrorModal, showSuccessModal } from "../../dialogs/Dialog";
import { user } from "../../service/User";
const RegisterView: React.FC<{}> = () => {
    useDocumentTitle("注册");
    const email = useInputValue("");
    const username = useInputValue("");
    const password = useInputValue("");
    const authToken = useInputValue("");
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [emailSended, setEmailSended] = useState(false);
    useEffect(() => {
        let token = setInterval(() => {
            if (countdown <= 0) {
                clearInterval(token);
            } else
                setCountdown(c => c - 1);
        }, 1000);
        return () => {
            clearInterval(token);
        };
    }, [countdown]);
    const sendEmail = async () => {
        if (countdown > 0) {
            showErrorModal("?");
            return;
        }
        setEmailSended(true);
        await user.requestEmail(email.value);
        setCountdown(60);
    };
    const submit = async () => {
        if (email.value === "" || username.value === "" || password.value === "") {
            showErrorModal("?");
            return;
        }
        try {
            setLoading(true);
            await user.register(email.value, username.value, password.value);
            await sendEmail();
            showSuccessModal("一封包含验证码的邮件已经发送到您邮箱(的垃圾箱)，请注意查收.");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    const auth = async () => {
        try {
            await user.authEmail(authToken.value);
            showSuccessModal("操作完成,请前往登陆页面进行登陆操作");
        } catch (e) {
            console.error(e);
        }
    };
    return <Container>
        <Grid columns="3">
            <Grid.Column></Grid.Column>
            <Grid.Column>
                <Header as="h1">
                    注册
                </Header>
                <Segment stacked >
                    <Form as="div">
                        <Form.Input disabled={emailSended} label="电子邮箱" {...email}></Form.Input>
                        <Form.Input disabled={emailSended} label="用户名" {...username}></Form.Input>
                        <Form.Input disabled={emailSended} type="password" label="密码" {...password}></Form.Input>
                        {<Form.Input label="验证码" action={
                            <Button loading={loading} disabled={countdown > 0} color="green" onClick={() => submit()}>{emailSended ? (countdown > 0 ? `${countdown}s` : "重发验证邮件") : "发送验证邮件"}</Button>
                        } {...authToken}></Form.Input>}
                        {emailSended && <Button color="blue" onClick={() => auth()}>
                            提交验证
                            </Button>}
                    </Form>
                </Segment>
            </Grid.Column>
            <Grid.Column></Grid.Column>
        </Grid>
    </Container>;
};

export default RegisterView;
