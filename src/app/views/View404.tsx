import React from "react";
import {
    Container, Grid, Segment
} from "semantic-ui-react";
const View404: React.FC<{}> = () => {
    document.title = "错误";
    return <Container textAlign="center">
        <Grid columns="3" centered>
            <Grid.Column width="16" textAlign="center">
                <Segment stacked>
                    <Container text style={{ fontSize: "70px", color: "red", height: "300px" }}>
                        页面不存在!
                    </Container>
                </Segment>
            </Grid.Column>
        </Grid>
    </Container>;
};

export default View404;