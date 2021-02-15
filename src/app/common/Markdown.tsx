import React from "react";
import showdown from "showdown";
import katex from "katex";
import { StateType, store } from "../states/Manager";
import { connect } from "react-redux";
import _ from "lodash";
const htmlDecode = (input: string) => {
    let doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent || "";

};
const converter = new showdown.Converter({
    extensions: [
        {
            type: 'output', regex: /\$\$([\S\s]+?)\$\$/g, replace: (x: string, y: string) => {
                let result = katex.renderToString(htmlDecode(y), {
                    throwOnError: false,
                    displayMode: true
                });
                return result;
            }
        },
        {
            type: 'output', regex: /\$([\S\s]+?)\$/g, replace: (x: string, y: string) => {
                let result = katex.renderToString(htmlDecode(y), {
                    throwOnError: false,
                    displayMode: false
                });
                return result;
            }
        }, {
            type: "output",
            regex: /!!!user-id!!!/g,
            replace: (x: string, y: string) => {
                return store.getState().userState.userData.username;
            }
        }
    ],
    tables: true,
    literalMidWordUnderscores: true,
    strikethrough: true
});



const Markdown = connect((state: StateType) => ({ state: state }))
    (((props) => {
        const { markdown } = props;
        return <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(markdown) }} {...(_.omit(props, ["markdown", "state", "dispatch"]))} >

        </div>
    }) as React.FC<{ markdown: string, state: StateType } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>);

export { converter, Markdown };