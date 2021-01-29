import { axiosObj as axios } from "../App";
import {
    Subject,
    Scene,
    Question,
    Submission
} from "./GameTypes";
import {
    user
} from "./User";
import axiosRaw from "axios";
type IDDecorator<T> = T & { _id: string };
type SceneListItem = IDDecorator<Scene<false>>;
type QuestionListItem = IDDecorator<Question<false>>;
type UnlockedSceneListItem = IDDecorator<Scene<true>>;
type SceneList = Array<SceneListItem>;
type QuestionList = Array<QuestionListItem>;
type UnlockedSceneList = Array<UnlockedSceneListItem>;
type UserSubmissionList = Array<Submission>;
const MONGODB_NULL = "000000000000000000000000"; //24个0
class GameManager {
    subjects: Array<Subject> = [];
    scenes: SceneList = [];
    questions: QuestionList = [];
    unlockedScenes: UnlockedSceneList = [];
    submissions: UserSubmissionList = [];
    questionByID: Map<string, QuestionListItem> = new Map();
    sceneByID: Map<string, SceneListItem> = new Map();
    firstSubmission: Map<string, Submission> = new Map();
    incomeScene: Map<string, SceneListItem> = new Map();
    public getIncomeScene(id: string): SceneListItem | null {
        const result = this.incomeScene.get(id);
        return result ? result : null;
    }
    public getFirstSubmissionByQuestion(id: string): Submission | null {
        const result = this.firstSubmission.get(id);
        return result ? result : null;
    }
    public getSubmissions() {
        return this.submissions;
    }
    public getSubjects() {
        return this.subjects;
    }
    public getQuestionByID(id: string) {
        return this.questionByID.get(id)!;
    }
    public getSceneByID(id: string) {
        return this.sceneByID.get(id)!;
    }

    public shouldChooseSubject(): boolean {
        return user.getUserInfo().last_question === MONGODB_NULL && user.getUserInfo().last_scene === MONGODB_NULL;
    }
    public isInitial(): boolean {
        return this.submissions.length === 0;
    }
    async loadData() {
        let resp = (await axiosRaw.all([
            axios.get("/subject"),
            axios.get("/scene"),
            axios.get("/question"),
            axios.get("/user/unlocked_scene"),
            axios.get("/user/submission")
        ])).map(item => item.data) as [
                { subject: Array<Subject> },
                { scene: SceneList },
                { question: QuestionList },
                { scene: UnlockedSceneList },
                { submission: UserSubmissionList }
            ];
        [this.subjects, this.scenes, this.questions, this.unlockedScenes, this.submissions] = [
            resp[0].subject,
            resp[1].scene,
            resp[2].question,
            resp[3].scene,
            resp[4].submission
        ];
        this.questionByID.clear();
        for (const item of this.questions) {
            this.questionByID.set(item._id, item);
        }
        this.sceneByID.clear();
        this.incomeScene.clear();
        for (const item of this.scenes) {
            this.sceneByID.set(item._id, item);
            this.incomeScene.set(item.next_question, item);
        }
        this.firstSubmission.clear();
        for (const item of this.submissions) {
            this.firstSubmission.set(item.question._id, item);
        }

    }
    async getSceneDetail(id: string) {
        return (await axios.get("/scene/" + id)).data as Scene<true>;
    }
    async getQuestionDetail(id: string) {
        return (await axios.get("/question/" + id)).data as Question<true>;
    }
    async unlockScene(id: string) {
        await axios.post(`/scene/${id}/unlock`);
    }
    async startAnswer(id: string) {
        await axios.post(`/question/${id}/start`);
    }
    async submitAnswer(questionID: string, option: Array<Array<number>>, file: Array<string>) {
        return (await axios.post(`/question/${questionID}/submission`, { option: option, file: file })).data as { _id: string };
    }
};

const game = new GameManager();

export { game, MONGODB_NULL };


export type {
    QuestionListItem
};