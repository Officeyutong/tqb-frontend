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
import _ from "lodash";

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
        this.subjects = ((await axios.get("/subject")).data as { subject: Array<Subject> }).subject;
        this.scenes = ((await axios.get("/scene")).data as { scene: SceneList }).scene;
        this.questions = ((await axios.get("/question")).data as { question: QuestionList }).question;
        this.unlockedScenes = ((await axios.get("/user/unlocked_scene")).data as { scene: UnlockedSceneList }).scene;
        this.submissions = ((await axios.get("/user/submission")).data as { submission: UserSubmissionList }).submission;
        for (const item of this.questions) {
            this.questionByID.set(item._id, item);
        }
        for (const item of this.scenes) {
            this.sceneByID.set(item._id, item);
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
    async submitAnswer(option?: Array<number>, file?: string) {
        return (await axios.post("/question/:id/submission", { option: option, file: file })).data as { _id: string };
    }
};

const game = new GameManager();

export { game, MONGODB_NULL };