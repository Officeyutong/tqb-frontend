import React, { useEffect, useState } from "react";

import { withRouter, RouteComponentProps, useHistory } from "react-router-dom";
import { Button, Dimmer, Grid, Header, Loader, Segment } from "semantic-ui-react";
import { useDocumentTitle } from "../../common/Utils";
import { game } from "../../service/Game";
import { Question } from "../../service/GameTypes";

type QuestionDetailType = Question<true>;
const NextSceneChooseView: React.FC<RouteComponentProps> = (props) => {
    const questionID = (props.match.params as { problemID: string }).problemID;
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState<QuestionDetailType | null>(null);
    const history = useHistory();
    useDocumentTitle("剧情选择");
    useEffect(() => {
        if (!loaded) {
            (async () => {
                setLoading(true);
                let data = await game.getQuestionDetail(questionID);
                setLoading(false);
                setData(data);
                setLoaded(true);
            })();
        }
    }, [loaded, questionID]);
    const doUnlock = async (id: string) => {
        try {
            setLoading(true);
            await game.unlockScene(id);
            history.push(`/game/scene/${id}`);
        } catch (e) {

        } finally {
            setLoading(false);
        }
    };
    return <div>
        <Header as="h1">
            题目 {game.getQuestionByID(questionID).title} 的后继剧情选择
        </Header>
        <Segment stacked>
            <Dimmer active={loading}>
                <Loader>
                    加载中...
                </Loader>
            </Dimmer>
            {loaded && (data !== null) && <Grid columns="1">
                {data.next_scene.map((item, i) => <Grid.Column key={i}>
                    <Button color="green" onClick={() => doUnlock(item.scene)}>
                        {item.option}
                    </Button>
                </Grid.Column>)}
            </Grid>}
        </Segment>
    </div>;
}

export default withRouter(NextSceneChooseView);