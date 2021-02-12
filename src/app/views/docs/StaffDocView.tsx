import React from "react";
import { Container, Grid, Header, Segment } from "semantic-ui-react";
import { useDocumentTitle } from "../../common/Utils";


const StaffDocView: React.FC = () => {
    useDocumentTitle("Staff列表 - 文档");
    return <Container>

        <Grid columns="3" centered>
            <Grid.Column width="16">
                <Header as="h1">
                    Staff列表
                </Header>
                <Segment stacked>
                    qwq
                </Segment>
            </Grid.Column>
        </Grid>
    </Container>;
};


export default StaffDocView;
