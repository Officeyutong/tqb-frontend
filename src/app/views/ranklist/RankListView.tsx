import React, { useEffect, useState } from "react";
import { Dimmer, Header, Item, Label, Loader, Segment, Statistic } from "semantic-ui-react";
import { axiosObj as axios } from "../../App";
import { makeGravatarImageURL, useDocumentTitle } from "../../common/Utils";
import { user } from "../../service/User";

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
                            {/* <Item.Meta>{item.email}</Item.Meta> */}
                            {user.getUserInfo().email === item.email && <Item.Meta>
                                <Label color="blue">我自己</Label>
                            </Item.Meta>}
                            <Item.Description>
                                <Statistic color="blue">
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
