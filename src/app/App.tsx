import React from "react";
import axios from "axios";
import { show, showErrorModal } from "./dialogs/Dialog";
import Router from "./Router";
// import { store } from './states/Manager';
import { Provider } from 'react-redux';
import { store, makeDataStateUpdateAction } from "./states/Manager";
import 'semantic-ui-css/semantic.min.css'
import { Container } from "semantic-ui-react";
import { APIError } from "./Exception";
import { user } from "./service/User";
import { game } from "./service/Game";
import "katex/dist/katex.min.css";
console.debug(process.env);
const BACKEND_BASE_URL = process.env.REACT_APP_BASE_URL;
const axiosObj = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true
});

console.debug(BACKEND_BASE_URL);
axiosObj.interceptors.request.use(req => {
  if (user.getLoginState()) {
    if (req.headers)
      req.headers!.Authorization = user.getAuthHeader();
    else req.headers = { Authorization: user.getAuthHeader() };
  }
  return req;
});
axiosObj.interceptors.response.use(resp => {
  let data = resp.data as {
    success: boolean;
    error: null | any;
    data?: any;
  };
  if (!data.success) {
    console.log(data);
    showErrorModal(JSON.stringify(data.error));
    throw new APIError(JSON.stringify(data.error));
  }
  resp.data = data.data;
  return resp;
}, err => {
  let resp = err.response;
  console.log(resp);
  if (resp)
    show(JSON.stringify(resp.data), resp.status + " " + resp.statusText, true);
  else
    show(JSON.stringify(err), "发生错误", true);
  throw err;
});
user.loadState();
(async () => {
  await user.loadState();
  if (user.getLoginState()) {
    await game.loadData();
    store.dispatch(makeDataStateUpdateAction(true));
  }
})();
const refreshUserAndGameData = async () => {
  await game.loadData();
  await user.loadUserInfo();
};
const App: React.FC<{}> = () => {

  return <Container style={{ width: "80%" }}>
    <Provider store={store} >
      <Router></Router>
    </Provider>
  </Container>;

};

export default App;
export { axiosObj, BACKEND_BASE_URL, refreshUserAndGameData }