import React, { useState, useEffect, useRef, useCallback } from "react";
import { game } from "../../service/Game";
import { Question, QuestionStatus, QuestionStatusMapping, Submission, SubQuestionType } from "../../service/GameTypes";
import { user } from "../../service/User";
import {
    converter
} from "../../common/Markdown";

import { withRouter, RouteComponentProps, useHistory } from "react-router-dom";
import { wrapDocumentTitle } from "../../common/Utils";
import { Button, Container, Dimmer, Header, Loader, Segment, Table, Rail, Sticky, Ref, Grid } from "semantic-ui-react";

import _ from "lodash";
import { NonSelectionSubquestionComponent, SelectionSubquestionComponent } from "./ProblemViewUtils";
import { showErrorModal } from "../../dialogs/Dialog";
type QuestionDetailType = Question<true>;
type SubmissionListType = (Array<number> | string | null)[];

const ProblemView: React.FC<RouteComponentProps> = (props) => {
    const problemID = (props.match.params as { id: string }).id;
    const history = useHistory();
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<QuestionDetailType | null>(null);
    const [audioLoaded, setAudioLoaded] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const stickyRef = useRef(null);
    const [dummy, setDummy] = useState(false);
    const [mySubmissions, setMySubmissions] = useState<SubmissionListType>([]);
    const [error, setError] = useState<Array<boolean>>([]);
    const [submitting, setSubmitting] = useState(false);
    const transformSubmission = useCallback(() => {
        let lastSubmission: (Submission | null) = null;
        for (const item of game.getSubmissions()) {
            if (item.question._id === problemID) {
                lastSubmission = item;
                break;
            }
        }
        if (lastSubmission === null) {
            return _.times(data!.sub_question.length, _.constant(null)); //没交过，全是null
        }
        const submissions: SubmissionListType = [];
        _.zip(lastSubmission.file, lastSubmission.option).forEach(([x, y], i) => {
            if (data!.sub_question[i].type === SubQuestionType.NON_SELECTION) {
                submissions.push(x!);
            } else submissions.push(y!);
        });

        return submissions;
    }, [data, problemID]);
    useEffect(() => {
        if (!loaded) {
            (async () => {
                setLoading(true);
                let data = await game.getQuestionDetail(problemID);
                setLoading(false);
                setData(data);
                setLoaded(true);
                document.title = wrapDocumentTitle(`${data.title} - 题目`);

                setError(_.times(data.sub_question.length, _.constant(false)));
            })();
        }
    }, [loaded, problemID, transformSubmission]);
    useEffect(() => {
        if (loaded) {
            setMySubmissions(transformSubmission());
        }
    }, [loaded, data, transformSubmission])
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
    const shouldShowSubmitButton: () => boolean = () => {
        if (data!.status !== QuestionStatus.ANSWERING) return false;
        if (data!.time_limit === 0) return true;
        const lastStart = user.getUserInfo().start_time;
        const now = parseInt(((new Date()).getTime() / 1000).toString());
        if (now > lastStart + data!.time_limit) {
            return false;
        } else {
            return true;
        }
    };
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
            return <div style={{ color: "orange", fontSize: "large" }}>{data!.time_limit - (now - lastStart)}秒</div>
        }
    };
    const doSubmit = async () => {
        try {
            setSubmitting(true);
            setError(mySubmissions.map(item => item === null));
            if (mySubmissions.some(x => x === null)) {
                showErrorModal("您存在未作答的题目，请返回查看。");
                setSubmitting(false);
                return;
            }
            const options: Array<Array<number>> = [];
            const files: Array<string> = [];
            for (let i = 0; i < data!.sub_question.length; i++) {
                const curr = data!.sub_question[i];
                if (curr.type === SubQuestionType.NON_SELECTION) {
                    files.push(mySubmissions[i] as (string));
                    options.push([]);
                } else {
                    options.push(mySubmissions[i] as (Array<number>));
                    files.push("");
                }
            }
            await game.submitAnswer(problemID, options, files);
            await game.loadData();
            await user.loadUserInfo();
            history.push(`/game/choose_scene/${problemID}`);
        } catch (e) {

        } finally {
            setSubmitting(false);
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
                        <div>
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
                            </Segment>
                            {(() => {
                                switch (data.status) {
                                    case QuestionStatus.LOCKED:
                                        return <>
                                            <Segment stacked>
                                                <Container textAlign="center">
                                                    <Button color="green" size="large" onClick={() => startAnswer()}>
                                                        开始作答
                                                </Button>
                                                </Container>
                                            </Segment>
                                        </>;
                                    case QuestionStatus.ANSWERING:
                                        return <>
                                            {shouldUsePlayer() && <Segment>
                                                <Dimmer active={!audioLoaded}>
                                                    <Loader>加载音频文件中...</Loader>
                                                </Dimmer>
                                                <div style={{ height: "400px" }}></div>
                                            </Segment>}
                                            {data.sub_question.map((item, i) => <div key={i}>
                                                <Segment stacked>
                                                    {item.type === SubQuestionType.SELECTION ? <SelectionSubquestionComponent
                                                        data={item}
                                                        error={error[i]}
                                                        setError={(x) => setError(error.map((val, j) => (j === i ? x : val)))}
                                                        userSubmission={mySubmissions[i] as (Array<number> | null)}
                                                        updateSubmission={(x) => setMySubmissions(mySubmissions.map((val, j) => (j === i ? x : val)))}
                                                    >
                                                    </SelectionSubquestionComponent> :
                                                        <NonSelectionSubquestionComponent
                                                            data={item}
                                                            error={error[i]}
                                                            setError={(x) => setError(error.map((val, j) => (j === i ? x : val)))}
                                                            userSubmission={mySubmissions[i] as (string | null)}
                                                            updateSubmission={(x) => setMySubmissions(mySubmissions.map((val, j) => (j === i ? x : val)))}
                                                        ></NonSelectionSubquestionComponent>}
                                                </Segment>
                                            </div>)}
                                        </>
                                    case QuestionStatus.SUBMITTED:
                                        return <>
                                            <Segment stacked>
                                                <Grid columns="3" centered>
                                                    <Grid.Column textAlign="center">
                                                        <Button color="green" onClick={() => history.push(`/game/choose_scene/${problemID}`)}>前往后继剧情选择</Button>
                                                    </Grid.Column>
                                                </Grid>
                                            </Segment>
                                        </>;
                                    default:
                                        return <div>
                                            ?????????????????
                                                </div>
                                }
                            })()}
                            <Rail position="right">
                                <Sticky context={stickyRef}>
                                    {data.status !== QuestionStatus.LOCKED && <Segment stacked>
                                        {<>
                                            <Container textAlign="center">
                                                <Header as="h3">时间限制</Header>
                                            </Container>
                                            <Grid columns="3" centered style={{ marginTop: "5px" }}>
                                                <Grid.Row>
                                                    <Grid.Column textAlign="center">
                                                        {makeRemainedTimeField()}</Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </>}
                                        {shouldShowSubmitButton() && <Grid columns="1" centered>
                                            <Grid.Column textAlign="center">
                                                <Button color="green" loading={submitting} onClick={() => doSubmit()}>
                                                    提交
                                                </Button>
                                            </Grid.Column>
                                        </Grid>}
                                    </Segment>}
                                </Sticky>
                            </Rail>
                        </div>
                    </Ref>
                </Grid.Column>
            </Grid>
        </>}
    </div>;
};


export default withRouter(ProblemView);