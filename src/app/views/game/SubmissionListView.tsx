import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Container, Header, Segment, Table } from "semantic-ui-react";
import { useDocumentTitle } from "../../common/Utils";
import { game } from "../../service/Game";

const SubmissionListView: React.FC<RouteComponentProps> = (props) => {
    const problemID = (props.match.params as { id?: string }).id;
    const data = game.getSubmissions().filter(item => problemID ? (item.question._id === problemID) : true);
    useDocumentTitle("查看我的提交");
    return <div>
        <Header as="h1">
            查看提交
        </Header>
        <Segment stacked>
            <Container>
                <Table basic="very" celled collapsing style={{ width: "100%" }}>
                    <Table.Header>
                        <Table.Row>
                            {["提交时间", "题目", "答题用时", "是否超时", "得分"].map((item, i) => <Table.HeaderCell textAlign='center' key={i}>{item}</Table.HeaderCell>)}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.map((item, i) => <Table.Row key={i}>
                            {[
                                <div>{new Date(item.time * 1000).toLocaleString()}</div>,
                                <a rel="noreferrer" target="_blank" href={`/game/question/${item.question._id}`}>{item.question.title}</a>,
                                <div>{item.answer_time} 秒</div>,
                                <div>{item.is_time_out ? "是" : "否"}</div>,
                                <div>{item.point === -1 ? "未评分" : item.point}</div>
                            ].map((item, i) => <Table.Cell textAlign="center" key={i} children={item}></Table.Cell>)}
                        </Table.Row>)}
                    </Table.Body>
                </Table>
            </Container>
        </Segment>
    </div>;
};


export default withRouter(SubmissionListView);
