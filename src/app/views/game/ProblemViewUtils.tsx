import React, { useRef, useState } from "react";
import { Button, Checkbox, Form, Grid, Message, Progress, Segment } from "semantic-ui-react";
import { converter } from "../../common/Markdown";
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

};
type SelectionSubquestionProps = {
    data: SelectionSubquestion;
    userSubmission: Array<number> | null;
    updateSubmission: (val: Array<number>) => void;
    error: boolean;
    setError: (val: boolean) => void;

};
const SelectionSubquestionComponent: React.FC<SelectionSubquestionProps> = ({ data, setError, updateSubmission, userSubmission, error }) => {

    const singleSelection = (data.full_point === 0);
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
        <span>本题满分 {data.full_point}，部分得分 {data.part_point} 。</span>
        <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(data.desc) }}></div>
        <Segment stacked>

            <Grid columns="1">
                <Grid.Column>
                    {error && <Message error>
                        <Message.Header>错误</Message.Header>
                        <p>本题尚未作答</p>
                    </Message>}
                </Grid.Column>
                <Grid.Column>
                    <Form>
                        {(() => {
                            if (singleSelection) {
                                return data.option.map((item, i) => <Form.Field key={i}>
                                    <Checkbox
                                        radio
                                        checked={userSubmission!.includes(i)}
                                        onChange={() => {
                                            updateSubmission([i]);
                                            setError(false);
                                        }}
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(item) }}></div>
                                    </Checkbox>
                                </Form.Field>)
                            } else {
                                return data.option.map((item, i) => <Form.Field key={i}>
                                    <Checkbox
                                        checked={userSubmission!.includes(i)}
                                        onChange={() => toggleAndUpdate(i)}
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(item) }}></div>
                                    </Checkbox>
                                </Form.Field>)
                            }
                        })()}
                    </Form>

                </Grid.Column>
            </Grid>
        </Segment>
    </div>;
};
const NonSelectionSubquestionComponent: React.FC<NonSelectionSubquestionProps> = ({ data, updateSubmission, userSubmission, setError, error }) => {
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

        <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(data.desc) }}></div>
        <Segment stacked>
            {error && <Message
                error
            >
                <Message.Header>错误</Message.Header>
                <p>本题尚未作答</p>
            </Message>}
            <Grid columns="2">
                <Grid.Column>
                    <span>本题满分 {data.full_point} 分</span>
                    {userSubmission === null ? <div>
                        您尚未作答过本题
                    </div> : <div>
                            您作答过本题，<button type="button" className="link-button" onClick={() => doDownload()}>点此下载</button>
                        </div>}
                </Grid.Column>
                <Grid.Column>
                    <Grid columns="1">
                        <Grid.Column>
                            <Grid columns="2">
                                <Grid.Column>
                                    <input type="file" ref={uploadElement}></input>
                                </Grid.Column>
                                <Grid.Column>
                                    <Button onClick={() => doUpload()} color="green" size="small" loading={uploading}>上传</Button>
                                </Grid.Column>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column>
                            {uploading && <Progress progress percent={percent} indicating></Progress>}
                        </Grid.Column>
                    </Grid>
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