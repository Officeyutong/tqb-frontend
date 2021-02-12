import React, { useEffect, useState } from "react";
import { converter } from "../../common/Markdown";
import { useDocumentTitle } from "../../common/Utils";
import axios from "axios";
import {
    Dimmer,
    Header,
    Loader,
    Segment
} from "semantic-ui-react";
interface DocViewPropsType {
    path: string;
    title: string;
};

const DocView: React.FC<DocViewPropsType> = ({ path, title }) => {
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [doc, setDoc] = useState("");
    useDocumentTitle(title + " - 文档");
    useEffect(() => {
        if (!loaded) {
            setLoading(true);
            axios.get(path).then(resp => {
                setDoc(resp.data as string);
                setLoading(false);
                setLoaded(true);
            });

        }
    }, [loaded, path]);
    return <div>
        <Header as="h1">
            {title}
        </Header>
        <Segment stacked>
            {loading && <>
                <div style={{ height: "300px" }}></div>
                <Dimmer active>
                    <Loader></Loader>
                </Dimmer>
            </>}
            <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(doc) }}></div>
        </Segment>
    </div>
};

export default DocView;