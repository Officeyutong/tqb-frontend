import React from "react";

import { Route, Switch, BrowserRouter as Router, RouteProps, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { StateType } from "./states/Manager";
import MainView from "./views/MainView";
import LoginView from "./views/LoginView";
import BaseView from "./views/BaseView";
import View404 from "./views/View404";
type RouterStateType = {
    userState: StateType["userState"]
};

const LoginCheckRoute = connect((state: StateType): RouterStateType => ({
    userState: state.userState
}))(((props) => {
    const { userState } = props;
    if (!userState.login && userState.userData.loaded) {
        console.log("Redirecting to the login page...");
        return <Redirect to="/login"></Redirect>
    } else {
        return <Route {...props}></Route>;
    }
}) as React.FC<RouteProps & RouterStateType>);

const MyRouter: React.FC<{}> = () => {

    return <Router>
        <Switch>
            <Route exact path="/login" component={LoginView}></Route>
            <BaseView>
                <Switch>
                    <LoginCheckRoute exact path="/" component={MainView} />
                    <Route path="*" exact component={View404}></Route>
                </Switch>
            </BaseView>
        </Switch>
    </Router>;
};

export default MyRouter;