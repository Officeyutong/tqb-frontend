import React from "react";
import {
    Container
} from "semantic-ui-react";
const View404: React.FC<{}> = () => {
    document.title = "错误";
    return <Container textAlign="center">
        <div style={{ fontSize: "70px", color: "red" }}>
            页面不存在!
        </div>
    </Container>;
};

export default View404;
