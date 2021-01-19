import React, { useState, useEffect } from "react";
import {
    useDocumentTitle,
    useInputValue
} from "../../common/Utils";
import { Button, Container, Dimmer, Form, Grid, Header, Loader, Segment } from "semantic-ui-react";
import {
    user
} from "../../service/User";
import { showErrorModal, showSuccessModal } from "../../dialogs/Dialog";

const ResetPasswordView: React.FC<{}> = () => {
    useDocumentTitle("重置密码");
    const email = useInputValue("");
    const password = useInputValue("");
    const token = useInputValue("");
    const [emailSended, setEmailSended] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
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
        if (email.value === "" || password.value === "") {
            showErrorModal("你重置个🔨");
            return;
        }
        try {
            setLoading(true);
            await sendEmail();
            showSuccessModal("一封包含验证码的邮件已经发送到您邮箱的垃圾箱，请注意查收.");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    const resetPassword = async () => {
        if (token.value === "") {
            showErrorModal("你重置个🔨");
            return;
        }
        try {
            setLoading(true);
            await user.modifyPasswordWithoutLogin(password.value, email.value, token.value);
            showSuccessModal("重置完成，请登录.");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    return <Container>
        <Dimmer active={loading}>
            <Loader></Loader>
        </Dimmer>
        <Grid columns="3">
            <Grid.Column></Grid.Column>
            <Grid.Column>
                <Header as="h1">
                    重置密码
                </Header>
                <Segment stacked >
                    <Form as="div">
                        <Form.Input disabled={emailSended} label="电子邮箱" {...email}></Form.Input>

                        <Form.Input disabled={emailSended} label="新密码" {...password}></Form.Input>
                        {emailSended && <Form.Input label="验证Token" {...token}></Form.Input>}
                        <Button disabled={countdown > 0} color="green" onClick={() => submit()}>{emailSended ? (countdown > 0 ? `${countdown}s` : "重发验证邮件") : "发送验证邮件"}</Button>
                        {emailSended && <Button color="blue" onClick={() => resetPassword()}>
                            提交验证
                </Button>}
                    </Form>
                </Segment>
            </Grid.Column>
            <Grid.Column></Grid.Column>
        </Grid>
    </Container>;
};

export default ResetPasswordView;