import React from "react";
import axios from "axios";
import { show } from "./dialogs/Dialog";
import Router from "./Router";
// import { store } from './states/Manager';
import { Provider } from 'react-redux';
import { makeUserStateUpdateAction, store } from "./states/Manager";
import 'semantic-ui-css/semantic.min.css'
import { Container } from "semantic-ui-react";
console.debug(process.env);
const BACKEND_BASE_URL = process.env.REACT_APP_BASE_URL;
console.debug(BACKEND_BASE_URL);
axios.defaults.baseURL = BACKEND_BASE_URL;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(resp => {
  return resp;
}, err => {
  let resp = err.response;
  if (resp)
    show(resp.data, resp.status + " " + resp.statusText, true);
  else
    show(String(err), "发生错误", true);
  throw err;
});
(async () => {
  let resp = await axios.post("/api/user/query_login_state");
  let data = resp.data as {
    code: number;
    data: {
      login: boolean;
      uid: number;
      username: string;
      displayname: string;

    };
    message?: string;
  };
  if (data.code) {
    show(data.message || "错误", "错误", true);
    return;
  }
  store.dispatch(makeUserStateUpdateAction(data.data.login, { uid: data.data.uid, displayname: data.data.displayname, username: data.data.username, loaded: true }))
})();

const App: React.FC<{}> = () => (
  // <div style={{
  //   // marginLeft: "10%",

  // }}>

  // </div>
  <Container style={{ width: "80%" }}>
    <Provider store={store} >
      <Router></Router>
    </Provider>
  </Container>
);

export default App;
