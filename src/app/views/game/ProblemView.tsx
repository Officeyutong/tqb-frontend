import React, { useState, useEffect, useRef } from "react";
import { game } from "../../service/Game";
import { Question, QuestionStatus, QuestionStatusMapping, NonSelectionSubquestion, SelectionSubquestion, Submission } from "../../service/GameTypes";
import { user } from "../../service/User";
import {
    converter
} from "../../common/Markdown";

import { withRouter, RouteComponentProps } from "react-router-dom";
import { wrapDocumentTitle } from "../../common/Utils";
import { Button, Container, Dimmer, Divider, Header, Loader, Segment, Table, Rail, Sticky, Ref, Grid } from "semantic-ui-react";
import { BACKEND_BASE_URL } from "../../App";
type QuestionDetailType = Question<true>;

type NonSelectionSubquestionProps = {
    data: NonSelectionSubquestion;
    userSubmission: Submission[]; //用户已上传的提交ID，设置为null表示未上传过
    updateSubmission: (id: string) => void;
};

const NonSelectionSubquestionComponent: React.FC<NonSelectionSubquestionProps> = ({ data, updateSubmission, userSubmission }) => {
    const [uploading, setUploading] = useState(false);
    const uploadElement = useRef(null);
    const doUpload = async () => {

    };
    const lastSubmission = () => userSubmission[userSubmission.length - 1];

    const lastSubmissionTime = () => new Date(lastSubmission().time * 1000).toLocaleString();
    return <div>
        <span>本题满分 {data.full_point}</span>
        <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(data.desc) }}></div>
        <Segment stacked>
            <Grid columns="2">
                <Grid.Column>
                    {userSubmission.length === 0 ? <div>
                        您尚未提交过本题
                    </div> : <div>
                            您最后于{lastSubmissionTime()}提交过本题。 <a target="_blank" rel="noreferrer" href={`${BACKEND_BASE_URL}/file/${lastSubmission().file!}`}>点此下载</a>
                        </div>}
                </Grid.Column>
            </Grid>
        </Segment>
    </div>;
};
const ProblemView: React.FC<RouteComponentProps> = (props) => {
    const problemID = (props.match.params as { id: string }).id;

    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<QuestionDetailType | null>(null);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const stickyRef = useRef(null);
    const [dummy, setDummy] = useState(false);
    useEffect(() => {
        if (!loaded) {
            (async () => {
                setLoading(true);
                let data = await game.getQuestionDetail(problemID);
                setLoading(false);
                setData(data);
                setLoaded(true);
                document.title = wrapDocumentTitle(`${data.title} - 题目`)
            })();
        }
    }, [loaded, problemID]);
    useEffect(() => {
        if (loaded) {
            if (data!.audio) {
                audioRef.current!.oncanplaythrough = () => setAudioLoaded(true);
            }
        }
    }, [data, loaded]);
    useEffect(() => {
        if (audioLoaded) {
            //执行到这的时候只能是audioLoaded从false到true
            console.log("Audio loaded.");
            const lastStart = user.getUserInfo().start_time;
            const now = parseInt(((new Date()).getTime() / 1000).toString());
            const player = audioRef.current!;
            player.currentTime = Math.max(now - lastStart - 3, 0); //提前三秒
        }
    }, [audioLoaded]);
    useEffect(() => {
        const shouldTakeCountdown: () => boolean = () => {
            // return true;
            if (data!.time_limit === 0) return false;
            const lastStart = user.getUserInfo().start_time;
            const now = parseInt(((new Date()).getTime() / 1000).toString());
            if (now <= lastStart + data!.time_limit + 5) return true;
            return false;
        };
        let token = setInterval(() => {
            if (shouldTakeCountdown()) {
                setDummy(x => !x);
            } else clearInterval(token);
        }, 1000);
        return () => {
            clearInterval(token);
        }
    }, [dummy, data]);
    const startAnswer = async () => {
        setLoading(true);
        await game.startAnswer(problemID);
        await user.loadUserInfo();
        await game.loadData();
        setData(await game.getQuestionDetail(problemID));
        setLoading(false);
    };
    const shouldUsePlayer: () => boolean = () => (data!.audio !== "");
    const makeRemainedTimeField = () => {
        // return <div style={{ color: "green", fontSize: "large" }}>{new Date().getTime()/1000}</div>
        if (data!.time_limit === 0) {
            return <div style={{ color: "green", fontSize: "large" }}>无限制</div>
        }
        const lastStart = user.getUserInfo().start_time;
        const now = parseInt(((new Date()).getTime() / 1000).toString());
        if (now > lastStart + data!.time_limit) {
            return <div style={{ color: "red", fontSize: "large" }}>已超时</div>
        } else {
            <div style={{ color: "yellow", fontSize: "large" }}>{data!.time_limit - (now - lastStart)}秒</div>
        }
    };
    return <div>
        {loading && (!loaded) && <Segment stacked>
            <div style={{ height: "300px" }}></div>
            <Dimmer active={loading}>
                <Loader>加载题目数据中...</Loader>
            </Dimmer>
        </Segment>}
        {loaded && (data !== null) && <>
            <Header as="h1">
                {data.title}
            </Header>
            <Grid columns="2">
                <Grid.Column>
                    <Ref innerRef={stickyRef}>
                        <Segment stacked>
                            <Dimmer active={loading}>
                                <Loader></Loader>
                            </Dimmer>
                            {(() => {
                                const problemMeta = [{ title: "题目标题", value: data.title },
                                { title: "时间限制", value: ((data.time_limit === 0) ? "不限制" : `${data.time_limit} 秒`) },
                                { title: "题目作者", value: data.author },
                                { title: "状态", value: QuestionStatusMapping[data.status] }];
                                return <Table celled basic="very" collapsing style={{ width: "100%" }}>
                                    <Table.Header>
                                        <Table.Row>
                                            {problemMeta.map(item => <Table.HeaderCell key={item.title}>{item.title}</Table.HeaderCell>)}
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        <Table.Row>
                                            {problemMeta.map((item, i) => <Table.Cell key={i}>{item.value}</Table.Cell>)}
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            })()}
                            <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(data.desc) }}></div>
                            {shouldUsePlayer() && <audio ref={audioRef} src={data.audio}>
                            </audio>}
                            <Divider></Divider>
                            {(() => {
                                switch (data.status) {
                                    case QuestionStatus.LOCKED:
                                        return <>
                                            <Container textAlign="center">
                                                <Button color="green" size="large" onClick={() => startAnswer()}>
                                                    开始作答
                                                </Button>
                                            </Container>
                                        </>;
                                    case QuestionStatus.ANSWERING:
                                        return <>
                                            {shouldUsePlayer() && <Dimmer active={!audioLoaded}>
                                                <Loader>加载音频文件中...</Loader>
                                            </Dimmer>}
                                        </>
                                    case QuestionStatus.SUBMITTED:
                                        return <></>;
                                    default:
                                        return <div>
                                            ?????????????????
                                                </div>
                                }
                            })()}
                            <Rail position="right">
                                <Sticky context={stickyRef}>
                                    <Segment stacked>
                                        <Container textAlign="center">
                                            <Header as="h3">时间限制</Header>
                                        </Container>
                                        <Grid columns="3" centered style={{ marginTop: "5px" }}>
                                            <Grid.Column textAlign="center">
                                                {makeRemainedTimeField()}</Grid.Column>
                                        </Grid>
                                    </Segment>
                                </Sticky>
                            </Rail>
                        </Segment>

                    </Ref>
                </Grid.Column>
            </Grid>

        </>}
    </div>;
};


export default withRouter(ProblemView);