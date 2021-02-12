import React, { useEffect, useState } from "react";
import { Container, Divider, Grid, Header, Item, Placeholder, Segment } from "semantic-ui-react";
import { useDocumentTitle } from "../../common/Utils";
import _ from "lodash";
import { converter } from "../../common/Markdown";
interface StaffMember {
    id: string;
    school: string;
    description: string;
    profileImage: string;
};
interface StaffGroup {
    groupName: string;
    members: StaffMember[];
};

type StaffDataType = StaffGroup[];

type MemberCardPropsType = {
    data: StaffMember;
};
const MemberCard: React.FC<MemberCardPropsType> = ({ data }) => {
    return <>
        <Segment>
            <Item.Group>
                <Item>
                    <Item.Image circular size="tiny" src={require(`../../../assets/staff-list/profile-images/${data.profileImage}`).default} style={{
                        height: "80px"
                    }}></Item.Image>
                    <Item.Content>
                        <Item.Header as="h3">
                            {data.id}
                        </Item.Header>
                        <Item.Meta>{data.school}</Item.Meta>
                        <Item.Description>
                            <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(data.description) }}></div>
                        </Item.Description>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    </>
};
const StaffDocView: React.FC = () => {
    useDocumentTitle("Staff列表 - 文档");
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState<StaffDataType | null>(null);
    useEffect(() => {
        if (!loaded) {
            setLoading(true);
            let resp = require("../../../assets/staff-list/data.json") as StaffDataType;
            setData(resp);
            setLoading(false);
            setLoaded(true);
        }
    }, [loaded]);
    return <Container>
        <Grid columns="3" centered>
            <Grid.Column width="16">
                <Header as="h1">
                    Staff列表
                </Header>
                <Segment stacked>
                    {loading ? <>
                        <Grid columns="3">
                            {_.times(3, i => <Grid.Column key={i}>
                                <Segment raised>
                                    <Placeholder>
                                        <Placeholder.Header image>
                                            <Placeholder.Line />
                                            <Placeholder.Line />
                                        </Placeholder.Header>
                                        <Placeholder.Paragraph>
                                            <Placeholder.Line length='medium' />
                                            <Placeholder.Line length='short' />
                                        </Placeholder.Paragraph>
                                    </Placeholder>
                                </Segment>
                            </Grid.Column>)}
                        </Grid>
                    </> : (data && <>
                        {data.map((item, i, arr) => <div key={i}>
                            <Header as="h2">
                                {item.groupName}
                            </Header>
                            <Grid columns="3">
                                {item.members.map((member, j) => <Grid.Column key={j}>
                                    <MemberCard data={member}></MemberCard>
                                </Grid.Column>)}
                            </Grid>
                            {i !== arr.length - 1 && <Divider></Divider>}
                        </div>)}
                    </>)}
                </Segment>
            </Grid.Column>
        </Grid>
    </Container>;
};


export default StaffDocView;
