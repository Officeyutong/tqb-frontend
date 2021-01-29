import React, { useEffect, useState } from "react";

import { withRouter, RouteComponentProps, useHistory } from "react-router-dom";
import { Scene } from "../../service/GameTypes";
import { game, MONGODB_NULL } from "../../service/Game";
import { wrapDocumentTitle } from "../../common/Utils";
import { Dimmer, Header, Loader, Segment, Grid, Divider, Button } from "semantic-ui-react";
import {
    converter
} from "../../common/Markdown";
import { refreshUserAndGameData } from "../../App";
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
                await refreshUserAndGameData();
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


            <Grid columns="3" centered>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <Header as="h1">
                            {data!.title}
                        </Header>
                        <Segment stacked>
                            <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(data.text) }}></div>

                            {data.next_question !== MONGODB_NULL && <>
                                <Divider></Divider>
                                <Button onClick={() => history.push("/game/question/" + data.next_question)} color="green">
                                    前往问题 {game.getQuestionByID(data.next_question).title}
                                </Button>
                            </>}
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>}
    </div>
};

export default withRouter(ScenePlayView);