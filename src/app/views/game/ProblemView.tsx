import React, { useState, useEffect } from "react";
import { axiosObj as axios } from '../../App';
import { game } from "../../service/Game";
import { Question, QuestionStatus, QuestionStatusMapping } from "../../service/GameTypes";
import { user } from "../../service/User";
import {
    converter
} from "../../common/Markdown";

import { withRouter, RouteComponentProps } from "react-router-dom";
import { wrapDocumentTitle } from "../../common/Utils";
import { Button, Container, Dimmer, Divider, Grid, Header, Loader, Segment, Table } from "semantic-ui-react";
type QuestionDetailType = Question<true>;
const ProblemView: React.FC<RouteComponentProps> = (props) => {
    const problemID = (props.match.params as { id: string }).id;

    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<QuestionDetailType | null>(null);
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
            return () => { document.title = "退群杯" };
        }
    }, [loaded, problemID]);
    return <div>
        {loading && <Segment stacked>
            <div style={{ height: "300px" }}></div>
            <Dimmer active={loading}>
                <Loader>加载题目数据中...</Loader>
            </Dimmer>
        </Segment>}
        {loaded && (data !== null) && <>
            <Header as="h1">
                {data.title}
            </Header>
            <Segment stacked>
                <Table celled basic="very" collapsing>
                    {[
                        { title: "题目标题", value: data.title },
                        { title: "时间限制", value: ((data.time_limit === 0) ? "不限制" : `${data.time_limit} 秒`) },
                        { title: "题目作者", value: data.author },
                        { title: "状态", value: QuestionStatusMapping[data.status] },
                    ].map(item => <Table.Row></Table.Row>)}
                </Table>
                <Divider></Divider>
                {(() => {
                    switch (data.status) {
                        case QuestionStatus.LOCKED:
                            return <>
                                <Container textAlign="center">
                                    <Button color="green">
                                        解锁
                                    </Button>
                                </Container>
                            </>;
                        case QuestionStatus.ANSWERING:
                            return <></>
                        case QuestionStatus.SUBMITTED:
                            return <></>;
                        default:
                            return <div>
                                ?????????????????
                            </div>
                    }
                })()}
            </Segment>
        </>}
    </div>;
};


export default withRouter(ProblemView);