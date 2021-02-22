enum SubQuestionType {
    NON_SELECTION = 1,
    SELECTION = 2
};
enum QuestionStatus {
    LOCKED = 0,
    ANSWERING = 1,
    SUBMITTED = 2
};
const QuestionStatusMapping = {
    [QuestionStatus.LOCKED]: "未解锁",
    [QuestionStatus.ANSWERING]: "正在作答",
    [QuestionStatus.SUBMITTED]: "已提交"
};
interface SelectionSubquestion {
    type: SubQuestionType.SELECTION;
    desc: string;
    option: Array<string>; //选项文本
    true_option: Array<string>;//选项ID
    full_point: number;
    part_point: number;
};
interface NonSelectionSubquestion {
    type: SubQuestionType.NON_SELECTION;
    desc: string;
    full_point: number;
};
type Question<withDetails> = {
    title: string;
    status: QuestionStatus;
} & (withDetails extends true ? {
    desc: string;
    statement: string;
    sub_question: Array<SelectionSubquestion | NonSelectionSubquestion>;
    author: string;
    audio: string;
    time_limit: number;
    next_scene: Array<{ scene: string; option: string; }>;
} : { next_scene: Array<string>; });
interface Subject {
    abbr: string;
    name: string;
    start_scene: string;
};

type Scene<withDetails>
    = {
        _id: string;
        from_question: string;
        next_question: string;
        title: string;

    } & (withDetails extends true ? { text: string; bgm: string; } : {});

interface Submission {
    _id: string;
    time: number;
    question: {
        _id: string;
        title: string;
    };
    file: Array<string>;
    option: Array<Array<number>>;
    point: number;
    answer_time: number;//作答耗时
    is_time_out: boolean;//是否答题超时
};

export type {
    NonSelectionSubquestion,
    Question,
    SelectionSubquestion,
    Scene,
    Subject,
    Submission
};

export {
    SubQuestionType,
    QuestionStatus,
    QuestionStatusMapping
}