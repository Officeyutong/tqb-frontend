import React, { useEffect } from "react";
import { useDocumentTitle } from "../../common/Utils";
import {
    Button,
    ButtonGroup,
    Header, Segment
} from "semantic-ui-react";
import { game, MONGODB_NULL } from "../../service/Game";
import { useHistory, withRouter } from "react-router-dom";
import { user } from "../../service/User";
const SubjectChooseView: React.FC<{}> = () => {
    useDocumentTitle("选择科目");
    const history = useHistory();
    useEffect(() => {
        if (!game.shouldChooseSubject()) {
            const info = user.getUserInfo();
            if (info.last_question === MONGODB_NULL && info.last_scene === MONGODB_NULL) {
                //都为null，说明应该选择科目
            } else if (info.last_question !== MONGODB_NULL && (info.last_scene === MONGODB_NULL || game.getSceneByID(info.last_scene).next_question == info.last_question)) {
                //（题目不为NULL，剧情为NULL），或者（题目不为NULL，剧情不为NULL，并且剧情的下一道题指向last_question）
                // 说明当前在做last_question或者已经做完了last_question但是没有选择出口剧情

                //如果finished_question包含了last_question，说明已经做完了last_question，应该跳转过去选择出口剧情
                //如果finished_question不包含last_question，说明last_question还没有做完，应该跳回去做题
                if (user.getFinishedQuestion().has(info.last_question)) {
                    history.push("/game/choose_scene/" + info.last_question);
                } else {
                    history.push("/game/problem/" + info.last_question);
                }
            } else if (info.last_question !== MONGODB_NULL && (game.getSceneByID(info.last_scene).from_question == info.last_question)) {
                //题目不为NULL，剧情不为NULL，且剧情的来源题目为last_question
                //说明现在正在看剧情
                history.push("/game/scene/" + info.last_scene);
            }
        }
    });
    return <div>
        <Header as="h1">
            选择科目
        </Header>
        <Segment stacked>
            <ButtonGroup>
                {game.getSubjects().map(item => <Button key={item.name} color="green" onClick={() => history.push("/game/scene/" + item.start_scene)}>
                    {item.abbr}
                </Button>)}
            </ButtonGroup>
        </Segment>
    </div>;
};

export default withRouter(SubjectChooseView);