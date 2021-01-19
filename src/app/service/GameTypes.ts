enum SubQuestionType {
    NON_SELECTION = 1,
    SELECTION = 2
};
enum QuestionStatus {
    LOCKED = 0,
    ANSWERING = 1,
    SUBMITTED = 2
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
    next_scene: Array<{ scene: string; option: string; }>;
    status: QuestionStatus;


} & (withDetails extends true ? {
    desc: string;
    subquestion: Array<SelectionSubquestion | NonSelectionSubquestion>;
    author: string;
    audio: string;
    time_limit: number;
} : {});
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

    } & (withDetails extends true ? { text: string; } : {});

interface Submission {
    _id: string;
    time: number;
    question: {
        _id: string;
        title: string;
    };
    file?: string;
    option?: Array<number>;
    point: number;
};

export type {
    NonSelectionSubquestion,
    Question,
    QuestionStatus,
    SelectionSubquestion,
    SubQuestionType,
    Scene,
    Subject,
    Submission
};