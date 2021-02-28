import React from "react";
import showdown from "showdown";
import { renderKatex } from "./katex-wrapper";
import { StateType, store } from "../states/Manager";
import { connect } from "react-redux";
import _ from "lodash";

const TREMA = String.fromCharCode(168);
const DOLLARD_CHR = TREMA + "D";
const converter = new showdown.Converter({
    extensions: [
        {
            type: 'lang', regex: `${DOLLARD_CHR}${DOLLARD_CHR}([\\S\\s]+?)${DOLLARD_CHR}${DOLLARD_CHR}`, replace: (x: string, y: string) => {
                return renderKatex(y, true);
            }
        },
        {
            type: 'lang', regex: `${DOLLARD_CHR}([\\S\\s]+?)${DOLLARD_CHR}`, replace: (x: string, y: string) => {
                return renderKatex(y, false);

            }
        },
        {
            type: 'lang', regex: `!!!bgm!!!`, replace: (x: string, y: string) => {
                return `<div>
                <button class="ui blue labeled icon button" id="bgm-button">
                <i class="icon" id="bgm-button-icon"></i>
                <div id="bgm-button-text"></div>
                </div>
                </div>`;
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