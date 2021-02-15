import React, { useRef, useState } from "react";
import { Button, Checkbox, Form, Grid, Message, Progress, Segment } from "semantic-ui-react";
import { Markdown } from "../../common/Markdown";
import { NonSelectionSubquestion, SelectionSubquestion } from "../../service/GameTypes";
import { BACKEND_BASE_URL, axiosObj as axios } from "../../App";
import "./LinkButton.css";
import { user } from "../../service/User";
type NonSelectionSubquestionProps = {
    data: NonSelectionSubquestion;
    userSubmission: string | null; //用户之前提交过的答案，如果未提交过则为null
    updateSubmission: (id: string) => void;
    error: boolean;
    setError: (val: boolean) => void;
    allowEdit: boolean;
};
type SelectionSubquestionProps = {
    data: SelectionSubquestion;
    userSubmission: Array<number> | null;
    updateSubmission: (val: Array<number>) => void;
    error: boolean;
    setError: (val: boolean) => void;
    allowEdit: boolean;

};
const SelectionSubquestionComponent: React.FC<SelectionSubquestionProps> = ({ data, setError, updateSubmission, userSubmission, error, allowEdit }) => {

    const singleSelection = () => (data.part_point === 0);
    const toggleAndUpdate = (pos: number) => {
        setError(false);
        if (userSubmission === null) {
            updateSubmission([pos]);
            return;
        }
        if (userSubmission.includes(pos)) {
            updateSubmission(userSubmission.filter(x => x !== pos));
        } else {
            updateSubmission([...userSubmission, pos]);
        }
    };
    return <div>
        <span>本题满分 <span style={{ color: "red" }}>{data.full_point} 分</span>，部分得分 <span style={{ color: "red" }}>{data.part_point} 分</span>。</span>
        <Markdown markdown={data.desc}></Markdown>
        <Segment stacked>

            <Grid columns="1">
                {error && <Grid.Column>
                    <Message error>
                        <Message.Header>错误</Message.Header>
                        <p>本题尚未作答</p>
                    </Message>
                </Grid.Column>}
                <Grid.Column>
                    <Form>
                        {data.option.map((item, i) => <Form.Field style={{ display: "flex" }} key={i}>
                            <Checkbox
                                radio={singleSelection()}
                                checked={userSubmission?.includes(i)}
                                onChange={() => {
                                    if (singleSelection()) updateSubmission([i]);
                                    else toggleAndUpdate(i);
                                    setError(false);
                                }}
                                disabled={!allowEdit}
                            // label={}
                            >

                            </Checkbox>
                            <Markdown style={{ marginLeft: "5px" }} markdown={item} ></Markdown>
                        </Form.Field>)}
                    </Form>
                </Grid.Column>
            </Grid>
        </Segment>
    </div>;
};
const NonSelectionSubquestionComponent: React.FC<NonSelectionSubquestionProps> = ({ data, updateSubmission, userSubmission, setError, error, allowEdit }) => {
    const [uploading, setUploading] = useState(false);
    const [percent, setPercent] = useState(0);
    const uploadElement = useRef<HTMLInputElement>(null);
    const doUpload = async () => {
        const data = new FormData();
        data.set("file", uploadElement.current!.files!.item(0)!);
        setUploading(true);
        setPercent(0);
        try {
            const resp = (await axios.post("/file", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress(evt) {
                    setPercent(evt.loaded / evt.total * 100);
                }
            })).data as { _id: string };
            updateSubmission(resp._id);
            setError(false);
        } catch (ex) {

        } finally {
            setUploading(false);
        }
    };
    const doDownload = async () => {
        const anchor = document.createElement("a");
        document.body.appendChild(anchor);
        const headers = new Headers();
        headers.append('Authorization', user.getAuthHeader());
        const resp = await fetch(`${BACKEND_BASE_URL}/file/${userSubmission!}`, { headers: headers });
        const blob = resp.blob();
        const objectURL = window.URL.createObjectURL(blob);
        anchor.href = objectURL;
        anchor.download = "user-download.pdf";
        anchor.click();
        window.URL.revokeObjectURL(objectURL);
    };
    return <div>

        <Markdown markdown={data.desc}></Markdown>
        <Segment stacked>
            {error && <Message
                error
            >
                <Message.Header>错误</Message.Header>
                <p>本题尚未作答</p>
            </Message>}
            <Grid columns="2">
                <Grid.Column>
                    <span>本题满分 <span style={{ color: "red" }}>{data.full_point} 分</span>。</span>
                    {userSubmission === null ? <div>
                        您尚未作答过本题
                    </div> : <div>
                        您作答过本题，<button type="button" className="link-button" onClick={() => doDownload()}>点此下载</button>
                    </div>}
                </Grid.Column>
                <Grid.Column>
                    {allowEdit && <Grid columns="1">
                        <Grid.Column>
                            <Grid columns="2">
                                <Grid.Column>
                                    <input type="file" ref={uploadElement} accept="application/pdf"></input>
                                </Grid.Column>
                                <Grid.Column>
                                    <Button onClick={() => doUpload()} color="blue" size="small" loading={uploading}>上传</Button>
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column>
                            {uploading && <Progress progress percent={Math.ceil(percent * 100) / 100} indicating></Progress>}
                        </Grid.Column>
                    </Grid>}
                </Grid.Column>
            </Grid>
        </Segment>
    </div>;
};

export {
    NonSelectionSubquestionComponent,
    SelectionSubquestionComponent
};

export type {
    NonSelectionSubquestionProps,
    SelectionSubquestionProps
}