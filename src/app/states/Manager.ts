import { createStore, Action } from 'redux';
import { UserInfoType } from "../service/User";

const defaultState = {
    userState: {
        login: false,
        userData: ({
            username: "",
            email: "",
        } as UserInfoType)
    },
    dataState: {
        loaded: false
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
export function makeDataStateUpdateAction(loaded: boolean) {
    return {
        type: 'DATASTATE_UPDATE',
        modify: (state: StateType) => {
            let result = {
                ...state,
                dataState: {
                    loaded: loaded
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
