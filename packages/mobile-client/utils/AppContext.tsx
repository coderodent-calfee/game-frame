import React, { createContext, useContext, useState, useEffect } from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {closeSocket, handleSessionUser, startSocket} from "@/utils/socket";
import {GetRequestOptions, makeGetRequest, makePostRequest} from "@/utils/requester";
import {EmitterSubscription} from "react-native/Libraries/vendor/emitter/EventEmitter";


// ***
// *** Interfaces
// ***
interface AppContextType {
    getStoredJSON: (key: string) => Promise<object | null>;
    getStoredString: (key: string) => Promise<string | null>;
    removeStoredItem: (key: string) => Promise<void>;
    screenSize: { width: number, height: number, corner:number };
    sessionId: string | null;
    setSessionId: (id: string | null) => void;
    setStoredJSON: (key: string, value: object) => Promise<void>;
    setStoredString: (key: string, value: string) => Promise<void>;
    setUserInfo: (info: any) => void;
    userInfo: any;
    appStyles: {
        mediumText: { color: string, fontSize: number },
        rowFlow: { flex: number, flexDirection: "row" },
        largeText: { color: string, fontSize: number },
        smallText: { color: string, fontSize: number },
        columnFlow: { flex: number, flexDirection: "column" }
    };
}

interface AuthenticatedSessionId {
    "message": string;
    "received_data": object;
    "sessionId": string;
}

export interface Player {
    playerId: string;
    name: string;
    gameId: string;
    userId?: string;
}

export interface GameType {
    gameId: string;
    players: Player[];
    status: string;
}

export interface GameInfoType {
    message?: string;
    game: GameType;
    player?: Player;
}

// ***
// *** Utilities
// ***
const figureScreenSize = ()=>{
    const dim = Dimensions.get('window');
    const minDim = Math.min(dim.height, dim.width);
    // screens: tv/computer width: 1536 height: 826
    // mobile portrait: width: 412 height: 733

    const corner = minDim > 800 ? 200 : minDim < 500 ? 90: 100;
    return({...dim, corner});
};

const figureFontSize = ()=>{
    const screenSize = figureScreenSize();
    const screenWidth = screenSize.width;
    const fontStyleLarge = screenWidth > 1500 ? styles.largeText : screenWidth < 500 ? styles.smallText : styles.mediumText;
    const fontStyleMedium = screenWidth > 1500 ? styles.mediumText : screenWidth < 500 ? styles.smallestText : styles.smallText;
    const fontStyleSmall = screenWidth > 1500 ? styles.smallText : styles.smallestText;
    return {
        ...styles,
        largeText: fontStyleLarge,
        mediumText: fontStyleMedium,
        smallText: fontStyleSmall,
    };
};
    
// ***
// *** Application Context Provider Component
// ***
const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [sessionId, setSessionId] = useState<string>();
    const [token, setToken] = useState<string>();
    const [seen, setSeen] = useState<string>();
    const [currentGameId, setCurrentGameId] = useState<string>();
    const [jwtRefresh, setJwtRefresh] = useState<string>();
    const [userInfo, setUserInfo] = useState<any>({});
    const [dimensionsSubscription, setDimensionsSubscription] = useState<EmitterSubscription>();
    const [screenSize, setScreenSize] = useState(figureScreenSize());
    const [appStyles, setAppStyles] = useState({...figureFontSize()});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshQueue, setRefreshQueue] = useState([]);


    useEffect(() => {
        console.log(`AppContext useEffect[currentGameId] will startSocket to gameId ${currentGameId}`)

        if(currentGameId){
            startSocket(currentGameId);
            setSessionId(generateSessionId());
        }

        return () => {
            closeSocket(); // Clean up on component unmount
        };
    }, [currentGameId]);
    
    function generateSessionId(): string {
        const array = new Uint8Array(16); // 16 bytes = 128 bits
        crypto.getRandomValues(array); // Fill the array with secure random values
        return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(""); // Convert to hex
    }

    const getStoredJSON = async (key: string): Promise<object | null> => {
        // console.log('getStoredJSON', key);
        return getStoredString(key).then(info => info && JSON.parse(info));
    };

    const setStoredJSON = async (key: string, value: object): Promise<void> => {
        // console.log(`setStoredJSON ${key}`, value);
        return setStoredString(key, JSON.stringify(value))
    };

    const getStoredString = async (key: string): Promise<string | null> => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        } else {
            return await AsyncStorage.getItem(key);
        }
    };

    const setStoredString = async (key: string, value: string): Promise<void> => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    };

    const removeStoredItem = async (key: string): Promise<void> => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    };

    async function refreshAuthToken(): Promise<string> {
        console.log("refreshAuthToken ");

        if (isRefreshing) {
            // Wait for the refresh to complete and get the new token
            return new Promise((resolve) => {
                setRefreshQueue((prevState)=>[...prevState, resolve]);
            });
        }

        setIsRefreshing(true);

        try {
            await makePostRequest<JwtUserId>({
                path : 'api/accounts/token/refresh/',
                body : {
                    "grant_type" : "refresh_token",
                    "refresh" : jwtRefresh,
                }
            })
            .then((response) => {
                console.log("api/accounts/token/refresh/:", response);
                signIn(response);
                refreshQueue.forEach((resolve) => resolve(response.access));
                setRefreshQueue([]);
                return response.access;
            }).catch((error) => {
                console.log("api/accounts/token/refresh/ failed:", error)
                console.log("api/accounts/token/refresh/ response:", error.response)
                throw error;
            });
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw error;
        } finally {
            setIsRefreshing(false);
        }
    }
    
    const contextGetRequest = async (args: GetRequestOptions): Promise<T> => {
        return makeGetRequest<T>(args).catch((error)=>{
            const code = error.response?.status;
            if(code === 401 && jwtRefresh){
                const newToken = refreshAuthToken();
                const newArgs : GetRequestOptions = args;
                newArgs['token'] = newToken;
                return makeGetRequest<T>(newArgs);
            }else{
                throw error;
            }
        });
    };
    

    interface JwtUserId {
        access: string;
        refresh: string;
        userId?: string;
    }

    const signIn = ({access, refresh, userId}:JwtUserId): boolean => {
        console.log('sign in: got token, refresh, and userId:', userId);
        setToken(access);
        setJwtRefresh(refresh);
        if(userId){
            setUserInfo((prevState) => { return { ...prevState, userId: userId }; });
        }
        return userId !== undefined;
    };

    // todo: there must be more to do here
    const signOut = (): void => {
        setToken(undefined);
    };



    const handleRefresh = async () => {
        console.log("handleRefresh ");
        // todo fail if nothing seen

        makePostRequest<JwtUserId>({
            path : 'api/accounts/token/refresh/',
            body : {
                "grant_type" : "refresh_token",
                "refresh" : jwtRefresh,
            }
        })
        .then((response) => {
            console.log("api/accounts/token/refresh/:", response);
            signIn(response);
        }).catch((error) => {
            console.log("api/accounts/token/refresh/ failed:", error)
            console.log("api/accounts/token/refresh/ response:", error.response)
        });
    };

    const handleResize = () => {
        const handleResize = () => {
            setScreenSize(figureScreenSize());
        };

//        Dimensions.addEventListener('change', handleResize);
        setDimensionsSubscription(Dimensions.addEventListener('change', handleResize))

        return () => {
//            Dimensions.removeEventListener('change', handleResize);
            dimensionsSubscription?.remove();
            setDimensionsSubscription(None)
        };
    };

// Send session user data when sessionId or userInfo changes
//     useEffect(() => {
//         if (sessionId) {
//             socket.handleSessionUser(sessionId, userInfo);
//         }
//     }, [sessionId, userInfo]);
    const loadStoredDataOnMount = () => {
        // Load stored data on mount
        const loadUserInfo = async () => {
            // console.log("AppContext useEffect[] load('userInfo')")
            const storedUserInfo = await getStoredJSON('userInfo');
            if (storedUserInfo) {
                // console.log(`Loaded stored user info:`, storedUserInfo);
                setUserInfo(storedUserInfo);
            }
        };
        const loadSeen = async () => {
            // console.log("AppContext useEffect[] loadSeen")
            const storedSeen = await getStoredJSON('seen');
            if (storedSeen) {
                // console.log(`Loaded stored seen:`, storedSeen);
                setJwtRefresh(storedSeen);
            }
        };
        loadSeen();
        loadUserInfo();
    };

    // This runs only once, after the component is mounted
    useEffect(() => {
        handleResize();
        loadStoredDataOnMount();
    }, []);


    useEffect(() => {
        // console.log("AppContext useEffect[userInfo] setStoredJSON('userInfo')", userInfo)
        const saveData = async () => {
            await setStoredJSON('userInfo', userInfo);
        };
        if (userInfo) {
            saveData(); // Save data if userInfo changes
        }
    }, [userInfo]);

    useEffect(() => {
        // console.log("AppContext useEffect[jwtRefresh] setStoredJSON('seen')", jwtRefresh)
        const saveData = async () => {
            await setStoredJSON('seen', jwtRefresh);
        };
        if (jwtRefresh) {
            saveData(); // Save data if userInfo changes
        }
    }, [jwtRefresh]);    
    
    useEffect(() => {
        console.log("AppContext useEffect[screenSize] setAppStyles")
        
        const currentAppStyles = figureFontSize();
        setAppStyles({...currentAppStyles});
    }, [screenSize]);


    useEffect(() => {
        // console.log(`appcontext useEffect [seen, sessionId]: ${jwtRefresh}/${sessionId}`);
        if(currentGameId && sessionId){
            if(jwtRefresh) {
                makePostRequest<AuthenticatedSessionId>({
                    path: 'api/accounts/protected/',
                    token,
                    body : {
                        sessionId
                    }
                })
                    .then((response) => {
                        // console.log("AuthenticatedSessionId response:", response);
                        handleSessionUser(sessionId, userInfo);
                    })
                    .catch((error) => {
                        // console.log("AuthenticatedSessionId failed:", error);
                        // console.log("AuthenticatedSessionId status code:", error.response?.status);
                        // if the response indicates that our token is expired, we can try to refresh it
                        handleRefresh();
                    });
            }
            else{
                console.log("AuthenticatedSessionId cannot be done; we should go back to home:")
            }
        }
    }, [ jwtRefresh, sessionId, currentGameId]);




    return (
        <AppContext.Provider
            value={{
                appStyles,
                contextGetRequest,
                currentGameId, setCurrentGameId,
                getStoredJSON, setStoredJSON,
                getStoredString, setStoredString,
                removeStoredItem,
                screenSize,
                sessionId, setSessionId,
                signIn, signOut,
                token, 
                userInfo,  setUserInfo,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};


interface PlayerInfo {
    [playerId: string]: any;
}

interface GamePlayerMap {
    [gameId: string]: PlayerInfo;
}

function getPlayerIdsByGameId(gameId: string, gamePlayerMap: GamePlayerMap): string[] {
    const players = gamePlayerMap[gameId];
    return players ? Object.keys(players) : [];
}


function removePlayerFromGame(gameId: string, playerId: string, gamePlayerMap: GamePlayerMap): void {
    if (gamePlayerMap[gameId]) {
        delete gamePlayerMap[gameId][playerId];
        if (Object.keys(gamePlayerMap[gameId]).length === 0) {
            delete gamePlayerMap[gameId];
        }
    }
}

// Custom hook for accessing the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};


const styles = StyleSheet.create({
    smallestText: {
        color: 'white',
        fontSize: 10,
    },
    smallText: {
        color: 'white',
        fontSize: 15,
    },
    mediumText: {
        color: 'white',
        fontSize: 20,
    },
    largeText: {
        color: 'white',
        fontSize: 30,
    },
    rowFlow: {
        flex: 1,
        flexDirection: 'row',
    },
    columnFlow: {
        flex: 1,
        flexDirection: 'column',
    },

});
