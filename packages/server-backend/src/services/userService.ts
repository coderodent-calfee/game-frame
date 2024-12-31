import {Player} from "@server-backend/models/player";


export interface UserInfo {
    userId: string;
    name: string;
}
interface SessionUserMap {
    [sessionId: string]: UserInfo;
}
const sessionUser : SessionUserMap = {};

export const getUserInfo = (sessionId: string): UserInfo | undefined => {
    return sessionUser[sessionId];
};
export const setUserInfo = (sessionId: string, userInfo: UserInfo) => {
    sessionUser[sessionId] = userInfo;
};

export default {getUserInfo: getUserInfo, setUserInfo};