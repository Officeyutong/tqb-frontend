import React from "react";
import { Grid, Header, Segment, Table } from "semantic-ui-react";
import { useDocumentTitle } from "../../common/Utils";
import { game, MONGODB_NULL } from "../../service/Game";
import { QuestionStatusMapping } from "../../service/GameTypes";

const GodModeListView: React.FC = () => {
    useDocumentTitle("上帝模式 - 题目及剧情列表");
    return <>
        <Grid columns="2" centered>
            <Grid.Column>
                <Header as="h1">
                    所有题目
                </Header>
                <Segment stacked>
                    <Table basic="very" celled>
                        <Table.Header>
                            <Table.Row>
                                {["题目名", "状态"].map((item, i) =>
                                    <Table.HeaderCell key={i}>
                                        {item}
                                    </Table.HeaderCell>)}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {game.getAllQuestions().map((item, i) => <Table.Row key={i}>
                                <Table.Cell>
                                    <a href={`/godmode/question/${item._id}`} target="_blank" rel="noreferrer">
                                        {item.title}
                                    </a>
                                </Table.Cell>
                                <Table.Cell>{QuestionStatusMapping[item.status]}</Table.Cell>
                            </Table.Row>)}
                        </Table.Body>
                    </Table>
                </Segment>
            </Grid.Column>
            <Grid.Column>
                <Header as="h1">
                    所有剧情
                </Header>
                <Segment stacked>
                    <Table basic="very" celled>
                        <Table.Header>
                            <Table.Row>
                                {["剧情名", "后继题目"].map((item, i) =>
                                    <Table.HeaderCell key={i}>
                                        {item}
                                    </Table.HeaderCell>)}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {game.getAllScenes().map((item, i) => <Table.Row key={i}>
                                <Table.Cell>
                                    <a href={`/godmode/scene/${item._id}`} target="_blank" rel="noreferrer">
                                        {item.title}
                                    </a>
                                </Table.Cell>
                                <Table.Cell>
                                    {item.next_question !== MONGODB_NULL && <a href={`/godmode/question/${game.getQuestionByID(item.next_question)._id}`} target="_blank" rel="noreferrer">
                                        {game.getQuestionByID(item.next_question).title}
                                    </a>}
                                </Table.Cell>
                            </Table.Row>)}
                        </Table.Body>
                    </Table>
                </Segment>
            </Grid.Column>
        </Grid>
    </>;
};

export default GodModeListView;
