import React from "react";

import { Route, Switch, BrowserRouter as Router, RouteProps, withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { StateType } from "./states/Manager";
import MainView from "./views/MainView";
import BaseView from "./views/BaseView";
import View404 from "./views/View404";

import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ResetPasswordView from "./views/auth/ResetPasswordView";

import GameRoute from "./views/game/GameRoute";

import DocView from "./views/DocView";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

type RequireDataLoadingRouteProps = { loaded: boolean };
const RequireDataLoadingRoute = connect(
    (state: StateType): RequireDataLoadingRouteProps => ({ loaded: state.dataState.loaded })
)(
    (
        (props) => {
            const { loaded } = props;
            if (!loaded) {
                return <Segment stacked>
                    <Dimmer active >
                        <Loader>加载数据中...</Loader>
                    </Dimmer>
                    <div style={{ height: "300px" }}></div>
                </Segment>
            } else {
                return <Route {...props}></Route>
            }
        }
    ) as React.FC<RouteProps & RequireDataLoadingRouteProps>
);
const DocRoute = withRouter(((props) => {

    return <Switch>
        <Route path={`${props.match.path}/tqb`} render={() => <DocView path={require("../assets/docs/tqb.md").default} title="退群杯简介"></DocView>}></Route>
        <Route path={`${props.match.path}/tqb-2nd`} render={() => <DocView path={require("../assets/docs/tqb-2nd.md").default} title="第二届退群杯简介"></DocView>}></Route>
        <Route path={`${props.match.path}/staff`} render={() => <DocView path={require("../assets/docs/staff.md").default} title="Staff简介"></DocView>}></Route>
        <Route path={`${props.match.path}/scene`} render={() => <DocView path={require("../assets/docs/scene.md").default} title="剧情简介"></DocView>}></Route>
    </Switch>
}) as React.FC<RouteComponentProps>);
const MyRouter: React.FC<{}> = () => {

    return <Router>
        <Switch>
            <BaseView>
                <Switch>
                    <Route exact path="/login" component={LoginView}></Route>
                    <Route exact path="/register" component={RegisterView}></Route>
                    <Route exact path="/reset_password" component={ResetPasswordView}></Route>
                    <Route exact path="/" component={MainView}></Route>
                    <Route path="/doc">
                        <DocRoute></DocRoute>
                    </Route>
                    <RequireDataLoadingRoute path="/game" render={() => <GameRoute></GameRoute>}></RequireDataLoadingRoute>
                    {/*用以匹配404页面*/}
                    <Route exact path="*" component={View404}></Route>
                </Switch>
            </BaseView>
        </Switch>
    </Router>;
};

export default MyRouter;