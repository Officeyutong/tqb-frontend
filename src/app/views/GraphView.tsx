import cytoscape, { EdgeSingular, NodeSingular } from 'cytoscape';
import React from "react";
import { game, MONGODB_NULL } from '../service/Game';
import CytoscapeComponent from 'react-cytoscapejs';
import { connect } from 'react-redux';
import { StateType } from '../states/Manager';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

type PropsType = {
    loaded: boolean;
};


const styles: cytoscape.Stylesheet[] = [
    {
        selector: 'node',
        style: {
            'background-color': 'yellow',
            'label': (x: NodeSingular) => game.getQuestionByID(x.id()).title
        }
    },

    {
        selector: 'edge',
        style: {
            'width': 3,
            'line-color': 'black',
            'target-arrow-color': 'black',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            "label": (x: EdgeSingular) => game.getSceneByID(x.id()).title
        }
    }
];

const GraphView: React.FC<PropsType> = (props) => {
    if (!props.loaded) {
        return <div>
            <Segment style={{
                width: "600px",
                height: "600px",
            }}>
                <Dimmer active>
                    <Loader>
                        加载中...
                    </Loader>
                </Dimmer>
            </Segment>
        </div>
    }
    const elements = [
        ...game.getAllQuestions().map(x => ({
            data: {
                id: x._id
            }
        })),
        ...game.getAllScenes().map(x => ({
            data: {
                id: x._id,
                source: x.from_question,
                target: x.next_question,

            }
        })).filter(x => (x.data.source !== MONGODB_NULL && x.data.target !== MONGODB_NULL))
    ];
    return <Segment><div style={{
        overflowX: "scroll",
        overflowY: "scroll"
    }}>

        <CytoscapeComponent
            elements={elements}
            stylesheet={styles}
            layout={{
                name: "cose"
            }}
            style={{
                width: "600px",
                height: "600px",
            }}
        ></CytoscapeComponent>

    </div>  </Segment >
};

export default connect(
    (state: StateType): PropsType => ({ loaded: state.dataState.loaded })
)(GraphView);
