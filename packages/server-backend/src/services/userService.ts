
// sessionId -> GameId
interface SessionUserMap {
    [sessionId: string]: string;
}
const sessionUser : SessionUserMap = {};

export const getUserName = (sessionId: string): string | undefined => {
    return sessionUser[sessionId];
};
export const setUserName = (sessionId: string, userName: string) => {
    sessionUser[sessionId] = userName;
};

export default {getUserName, setUserName};