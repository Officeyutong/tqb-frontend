import { createStore, Action } from 'redux';

const defaultState = {
    userState: {
        login: false,
        userData: {
            uid: -1,
            username: "qwq",
            displayname: "qwq",
            loaded: false
        }
    }
};
export type StateType = typeof defaultState;
export interface SimpleAction extends Action<string> {
    readonly type: string;
    modify(arg0: StateType): StateType;
}
export function makeUserStateUpdateAction(login: boolean, userData: StateType["userState"]["userData"]) {
    return {
        type: 'USERSTATE_UPDATE',
        modify: (state: StateType) => {
            let result = {
                ...state,
                userState: {
                    login: login,
                    userData: userData
                }
            };
            return result;
        },
    } as SimpleAction;
}

const myReducer = (state = defaultState, action: SimpleAction) => {
    if (!action.type.startsWith('@@redux')) {
        return action.modify(state);
    } else {
        return state;
    }
};

const store = createStore(myReducer);

export { store };
