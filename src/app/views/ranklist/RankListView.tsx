import React, { useEffect, useState } from "react";
import { Dimmer, Divider, Grid, Header, Item, Loader, Segment, Statistic } from "semantic-ui-react";
import { axiosObj as axios } from "../../App";
import { makeGravatarImageURL, useDocumentTitle } from "../../common/Utils";

interface RanklistItem {
    username: string;
    email: string;
    point: number;
};
type RanklistListType = RanklistItem[];

const RanklistView: React.FC = () => {
    const [data, setData] = useState<RanklistListType | null>(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    useDocumentTitle("排行榜");
    useEffect(() => {
        if (!loaded) {
            (async () => {
                setLoading(true);
                let resp = (await axios.get("/rank")).data as { rank: RanklistListType };
                setLoading(false);
                setData(resp.rank);
                setLoaded(true);
            })();
        }
    }, [loaded]);
    return <div>
        <Header as="h1">
            排行榜
        </Header>
        <Segment stacked>
            <Dimmer active={loading}>
                <Loader>加载数据中..</Loader>
            </Dimmer>
            {loaded && (data !== null) && <div>
                <Item.Group divided>
                    {data.map((item, i) => <Item key={i}>
                        <Item.Image size="tiny" src={makeGravatarImageURL(item.email)}></Item.Image>
                        <Item.Content>
                            <Item.Header>
                                #{i + 1}. {item.username}
                            </Item.Header>
                            <Item.Meta>{item.email}</Item.Meta>
                            <Item.Description>
                                <Statistic color="green">
                                    <Statistic.Value>
                                        {item.point}
                                    </Statistic.Value>
                                </Statistic>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                    )}
                </Item.Group>
            </div>}
        </Segment>
    </div>;
};

export default RanklistView;
