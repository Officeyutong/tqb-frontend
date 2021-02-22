import React from "react";
import showdown from "showdown";
import katex from "katex";
import { StateType, store } from "../states/Manager";
import { connect } from "react-redux";
import _ from "lodash";

const TREMA = String.fromCharCode(168);
const DOLLARD_CHR = TREMA + "D";
const converter = new showdown.Converter({
    extensions: [
        {
            type: 'lang', regex: `${DOLLARD_CHR}${DOLLARD_CHR}([\\S\\s]+?)${DOLLARD_CHR}${DOLLARD_CHR}`, replace: (x: string, y: string) => {
                let result = katex.renderToString(y, {
                    throwOnError: true,
                    displayMode: true
                });
                return result;
            }
        },
        {
            type: 'lang', regex: `${DOLLARD_CHR}([\\S\\s]+?)${DOLLARD_CHR}`, replace: (x: string, y: string) => {
                let result = katex.renderToString(y, {
                    throwOnError: true,
                    displayMode: false
                });
                return result;
            }
        },
        {
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