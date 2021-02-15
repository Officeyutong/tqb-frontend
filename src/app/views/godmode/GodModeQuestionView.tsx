import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dimmer, Grid, Header, Loader, Segment, Table } from "semantic-ui-react";
import { Markdown } from "../../common/Markdown";
import { wrapDocumentTitle } from "../../common/Utils";
import { game } from "../../service/Game";
import { Question, QuestionStatusMapping, Submission, SubQuestionType } from "../../service/GameTypes";
import { NonSelectionSubquestionComponent, SelectionSubquestionComponent } from "../game/ProblemViewUtils";
type QuestionDetailType = Question<true>;
type SubmissionListType = (Array<number> | string | null)[];
const GodModeProblemView: React.FC<RouteComponentProps> = (props) => {
    const questionID = (props.match.params as { id: string }).id;
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<QuestionDetailType | null>(null);
    const [mySubmissions, setMySubmissions] = useState<SubmissionListType>([]);
    const transformSubmission = useCallback((data: QuestionDetailType) => {
        let lastSubmission: (Submission | null) = null;
        for (const item of game.getSubmissions()) {
            if (item.question._id === questionID) {
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
    }, [questionID]);
    useEffect(() => {
        if (!loaded) {
            (async () => {
                setLoading(true);
                const data = await game.getQuestionDetail(questionID);
                setLoading(false);
                setData(data);
                setLoaded(true);
                setMySubmissions(transformSubmission(data));
                document.title = wrapDocumentTitle(`${data.title} - 题目`);
            })();
        }
    }, [loaded, questionID, transformSubmission]);
    const shouldUsePlayer: () => boolean = () => (data!.audio !== "");
    return <div>
        {loading && (!loaded) && <Segment stacked>
            <div style={{ height: "300px" }}></div>
            <Dimmer active={loading}>
                <Loader>加载题目数据中...</Loader>
            </Dimmer>
        </Segment>}
        {loaded && (data !== null) && <>

            <Grid columns="3" centered>
                <Grid.Column width="8">
                    <Header as="h1">
                        {data.title}
                    </Header>
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
                        <Markdown markdown={data.desc}></Markdown>
                        {shouldUsePlayer() && <audio src={data.audio} controls={true}>
                        </audio>}
                    </Segment>
                    {data.sub_question.map((item, i) => <div key={i}>
                        <Segment stacked>
                            {item.type === SubQuestionType.SELECTION ? <SelectionSubquestionComponent
                                data={item}
                                error={false}
                                setError={(x) => { }}
                                userSubmission={mySubmissions[i] as (Array<number> | null)}
                                updateSubmission={(x) => { }}
                                allowEdit={false}
                            >
                            </SelectionSubquestionComponent> :
                                <NonSelectionSubquestionComponent
                                    data={item}
                                    error={false}
                                    setError={(x) => { }}
                                    userSubmission={mySubmissions[i] as (string | null)}
                                    updateSubmission={(x) => { }}
                                    allowEdit={false}
                                ></NonSelectionSubquestionComponent>}
                        </Segment>
                    </div>)}
                </Grid.Column>
            </Grid>
        </>}
    </div>;
};

export default withRouter(GodModeProblemView);