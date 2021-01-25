import React, { useEffect, useState } from "react";

import { withRouter, RouteComponentProps, useHistory } from "react-router-dom";
import { Scene } from "../../service/GameTypes";
import { game } from "../../service/Game";
import { wrapDocumentTitle } from "../../common/Utils";
import { Dimmer, Header, Loader, Segment, Grid, Divider, Button } from "semantic-ui-react";
import {
    converter
} from "../../common/Markdown";
type SceneDetail = Scene<true>;
const ScenePlayView: React.FC<RouteComponentProps> = props => {
    const sceneID = (props.match.params as { id: string }).id;
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SceneDetail | null>(null);
    const history = useHistory();
    useEffect(() => {
        if (!loaded) {
            (async () => {
                setLoading(true);
                let data = await game.getSceneDetail(sceneID);
                document.title = wrapDocumentTitle(`${data.title} - 剧情`)
                setLoading(false);
                setData(data);
                setLoaded(true);
            })();
            return () => { document.title = "退群杯"; }
        }
    }, [loaded, sceneID]);
    return <div>

        {loading && <Segment stacked>
            <>
                <Dimmer>
                    <Loader></Loader>
                </Dimmer>
                <div style={{ minHeight: "300px" }}>
                </div>
            </>

        </Segment>}
        {(loaded && data !== null) && <>
            <Header as="h1">
                {data!.title}
            </Header>
            <Segment stacked>
                <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(data.text) }}></div>
                <Divider></Divider>
                <Grid columns="3">
                    <Grid.Column></Grid.Column>
                    <Grid.Column textAlign="center">
                        {/*剧情跳转到题目不需要刷新数据*/}
                        <Button onClick={() => history.push("/game/problem/" + data.next_question)} color="green">
                            前往问题 {game.getQuestionByID(data.next_question).title}
                        </Button>
                    </Grid.Column>
                    <Grid.Column></Grid.Column>

                </Grid>
            </Segment>
        </>}
    </div>
};

export default withRouter(ScenePlayView);