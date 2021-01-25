import { axiosObj as axios } from "../App";
import axiosRaw from "axios";
import {
    Subject,
    Scene,
    Question,
    Submission
} from "./GameTypes";

type SceneList = Array<Scene<false> & { _id: string }>;
type QuestionList = Array<Question<false> & { _id: string }>;
type UnlockedSceneList = Array<Scene<true> & { _id: string }>;
type UserSubmissionList = Array<Submission>;

class GameManager {
    subjects: Array<Subject> = [];
    scenes: SceneList = [];
    questions: QuestionList = [];
    unlockedScenes: UnlockedSceneList = [];
    submissions: UserSubmissionList = [];
    public isInitial(): boolean {
        return this.submissions.length === 0;
    }
    async loadData() {
        this.subjects = ((await axios.get("/subject")).data as { subject: Array<Subject> }).subject;
        this.scenes = ((await axios.get("/scene")).data as { scene: SceneList }).scene;
        this.questions = ((await axios.get("/question")).data as { question: QuestionList }).question;
        this.unlockedScenes = ((await axios.get("/user/unlocked_scene")).data as { scene: UnlockedSceneList }).scene;
        this.submissions = ((await axios.get("/user/submission")).data as { submission: UserSubmissionList }).submission;
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

export { game };