import React, { useEffect, useRef, useState } from "react";

import { withRouter, RouteComponentProps, useHistory } from "react-router-dom";
import { Scene } from "../../service/GameTypes";
import { game, MONGODB_NULL } from "../../service/Game";
import { wrapDocumentTitle } from "../../common/Utils";
import { Dimmer, Header, Loader, Segment, Grid, Divider, Button } from "semantic-ui-react";
import {
    Markdown
} from "../../common/Markdown";
import { refreshUserAndGameData } from "../../App";
type SceneDetail = Scene<true>;
/*
BGM: /static/audio/final_phase.mp3
*/
const ScenePlayView: React.FC<RouteComponentProps> = props => {
    const sceneID = (props.match.params as { id: string }).id;
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SceneDetail | null>(null);
    // const [audioLoaded, setAudioLoaded] = useState(false);
    // const [audioLoading, setAudioLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    // const BGMPlayButtonRef = useRef<HTMLButtonElement>(null);
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
                // setAudioLoading(true);
                {
                    const BGMButton = document.getElementById("bgm-button") as HTMLButtonElement;
                    const BGMButtonText = document.getElementById("bgm-button-text");
                    if (BGMButton) {
                        BGMButtonText!.innerText = "加载BGM中";
                        const BGMIcon = document.getElementById("bgm-button-icon")!;
                        BGMIcon.classList.add("spinner", "loading");

                    }

                }
            })();
            return () => { document.title = "退群杯"; }
        }
    }, [loaded, sceneID]);
    useEffect(() => {
        if (loaded) {
            audioRef.current!.oncanplaythrough = () => {
                // setAudioLoaded(true);
                // setAudioLoading(false);
                const BGMButton = document.getElementById("bgm-button") as HTMLButtonElement;
                if (BGMButton) {
                    const BGMButtonText = document.getElementById("bgm-button-text")!;
                    const BGMIcon = document.getElementById("bgm-button-icon")!;
                    BGMIcon.classList.remove("spinner", "loading");
                    BGMIcon.classList.add("checkmark");
                    BGMButtonText.innerText = "播放BGM";
                    BGMButton.onclick = () => {
                        audioRef.current!.play();
                    };
                }
            };
        }
    }, [loaded]);
    return <div>

        {loading && <Segment stacked>
            <>
                <Dimmer active>
                    <Loader>加载中...</Loader>
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
                            <audio src={data.bgm} ref={audioRef}></audio>
                            {/* {data.bgm && <>
                                
                                {audioLoading && <Button color="blue" icon labelPosition="left">
                                    <Icon name="spinner" loading></Icon>
                                        加载BGM中
                                    </Button>}
                                {audioLoaded && <Button color="blue" icon labelPosition="left" onClick={() => audioRef.current!.play()}>
                                    <Icon name="checkmark"></Icon>
                                        播放BGM
                                    </Button>}
                                <Divider></Divider>
                            </>} */}

                            <Markdown markdown={data.text}></Markdown>

                            {data.next_question !== MONGODB_NULL && <>
                                <Divider></Divider>
                                <Button onClick={() => history.push("/game/question/" + data.next_question)} color="blue">
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