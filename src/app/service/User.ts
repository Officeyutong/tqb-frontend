// import { encrypt } from "./jsencrypt-wrapper";
import {axiosObj as axios} from "../App";
import {
    makeUserStateUpdateAction, store
} from "../states/Manager";
import NodeRSA from "node-rsa";
const encrypt: (publicKey: string, plainText: string) => string = (publicKey: string, plainText: string) => {
    const key = new NodeRSA();
    key.setOptions({
        encryptionScheme: "pkcs1_oaep"
    });
    key.importKey(publicKey);
    return key.encrypt(plainText, "base64");
};
interface UserStateType {
    token: string;
    expire: number;
};
interface UserInfoType {
    _id: string;
    username: string;
    email: string;
    is_email_verified: boolean;
    last_question: string;
    last_scene: string;
    start_time: number;
    unlocked_scene: Array<string>;
    finished_question: Array<string>;
};
interface LocalStoragePackageType {
    userState: UserStateType;
};
const LOCAL_STORAGE_KEY_NAME = "tqb-frontend-user";
class User {
    private alreadyLogin: boolean = false;
    private userState: UserStateType | null = null;
    private userInfo: UserInfoType | null = null;
    logout() {
        this.alreadyLogin = false;
        this.userInfo = null;
        this.userState = null;
        this.saveState();
        this.dispatchToStore();
    }
    dispatchToStore() {
        console.log("dispatch", this.userInfo);
        store.dispatch(makeUserStateUpdateAction(
            this.alreadyLogin,
            { ...(this.userInfo || { email: "", username: "", _id: "", finished_question: [], is_email_verified: false, last_question: "", last_scene: "", start_time: -1, unlocked_scene: [] }) }
        ));
    }
    getAuthHeader(): string {
        return `Bearer ${this.userState!.token}`;
    }
    getLoginState(): boolean {
        return this.alreadyLogin;
    }
    async loadUserInfo() {
        let resp = (await axios.get("/user")).data as UserInfoType;
        this.userInfo = resp;
    }
    async allocatePublicKey(email: string): Promise<string> {
        let tokenResp = (await axios.get("/user/public_key", { params: { email: email } })).data as {
            public_key: string;
        };
        return tokenResp.public_key;
    }
    async login(email: string, password: string): Promise<void> {
        this.validate();
        if (this.alreadyLogin) {
            return;
        }
        let publicKey = await this.allocatePublicKey(email);
        let loginResp = (await axios.get("/user/token", { params: { email: email, password: encrypt(publicKey, password) } })).data as UserStateType;
        this.alreadyLogin = true;
        this.userState = loginResp;
        this.loadUserInfo();
        this.saveState();
        this.dispatchToStore();

    }
    async register(email: string, username: string, password: string) {
        this.validate();
        if (this.alreadyLogin) return;
        let publicKey = await this.allocatePublicKey(email);
        (await axios.post("/user", {
            email: email,
            username: username,
            password: encrypt(publicKey, password)
        }));
    }
    async requestEmail(email: string) {
        await axios.get("/user/email_verify", { params: { email: email } });
    }
    async modifyPasswordWithoutLogin(password: string, email: string, resetID: string) {
        this.validate();
        let publicKey = await this.allocatePublicKey(email);
        await axios.put("/user/password", { password: encrypt(publicKey, password) }, { params: { verify_id: resetID } });
    }
    async modifyPasswordWhenLogin(password: string) {
        this.validate();
        let publicKey = await this.allocatePublicKey(this.userInfo!.email);
        await axios.put("/user/password", { password: encrypt(publicKey, password) });
    }

    async authEmail(token: string) {
        await axios.post("/user/email_verify", {}, { params: { verify_id: token } });
    }
    validate() {
        if (this.userState) {
            if (new Date().getTime() / 1000 >= this.userState.expire) {
                this.logout();
            }
        }
    }
    public loadState() {
        let data = (window.localStorage.getItem(LOCAL_STORAGE_KEY_NAME));
        if (data) {
            this.alreadyLogin = true;
            let user = JSON.parse(data) as LocalStoragePackageType;
            this.userState = user.userState;
            this.loadUserInfo().then(() => {
                this.validate();
                this.dispatchToStore();
            });

        }
    }
    public saveState() {
        this.validate();
        if (!this.alreadyLogin) {
            window.localStorage.removeItem(LOCAL_STORAGE_KEY_NAME);
        }
        else {
            let output = JSON.stringify({
                userState: this.userState
            } as LocalStoragePackageType);
            window.localStorage.setItem(LOCAL_STORAGE_KEY_NAME, output);
        }
    }

};

const user = new User();

export { user };

export type { UserInfoType };