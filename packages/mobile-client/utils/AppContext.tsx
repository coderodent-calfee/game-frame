import React, { createContext, useContext, useState, useEffect } from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import socket from "@/utils/socket";
import {makePostRequest} from "@/utils/requester";
import {EmitterSubscription} from "react-native/Libraries/vendor/emitter/EventEmitter";

// Define the shape of the context state
interface AppContextType {
    sessionId: string | null;
    setSessionId: (id: string | null) => void;
    userInfo: any;
    setUserInfo: (info: any) => void;
    getStoredString: (key: string) => Promise<string | null>;
    setStoredString: (key: string, value: string) => Promise<void>;
    getStoredJSON: (key: string) => Promise<object | null>;
    setStoredJSON: (key: string, value: object) => Promise<void>;
    removeStoredItem: (key: string) => Promise<void>;
    screenSize: { width: number, height: number, corner:number };
    appStyles: {
        mediumText: { color: string, fontSize: number },
        rowFlow: { flex: number, flexDirection: "row" },
        largeText: { color: string, fontSize: number },
        smallText: { color: string, fontSize: number },
        columnFlow: { flex: number, flexDirection: "column" }
    };
}


export interface Player {
    playerId: string;
    name: string;
    gameId: string;
}

interface AuthenticatedSessionId {
    "message": string;
    "received_data": object;
    "sessionId": string;
}


// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [sessionId, setSessionId] = useState<string>();
    const [token, setToken] = useState<string>();
    const [seen, setSeen] = useState<string>();
    const [currentGameId, setCurrentGameId] = useState<string>();
    const [jwtRefresh, setJwtRefresh] = useState<string>();
    const [userInfo, setUserInfo] = useState<any>({});
    const [dimensionsSubscription, setDimensionsSubscription] = useState<EmitterSubscription>();
    const figureScreenSize = ()=>{
        const dim = Dimensions.get('window');
        const minDim = Math.min(dim.height, dim.width);
        // screens: tv/computer width: 1536 height: 826
        // mobile portrait: width: 412 height: 733

        const corner = minDim > 800 ? 200 : minDim < 500 ? 90: 100;
        return({...dim, corner});
    };
    const [screenSize, setScreenSize] = useState(figureScreenSize());
    const [appStyles, setAppStyles] = useState({...styles});

    const storage = Platform.OS === 'web' ? localStorage : AsyncStorage;

    function generateSessionId(): string {
        const array = new Uint8Array(16); // 16 bytes = 128 bits
        crypto.getRandomValues(array); // Fill the array with secure random values
        return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(""); // Convert to hex
    }

    const getStoredJSON = async (key: string): Promise<object | null> => {
        console.log('getStoredJSON', key);
        return getStoredString(key).then(info => info && JSON.parse(info));
    };

    const setStoredJSON = async (key: string, value: object): Promise<void> => {
        console.log(`setStoredJSON ${key}`, value);
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

    function addPlayerToGame(gameId: string, playerData: Player, gamePlayerMap: GamePlayerMap): object {
        const playerId: string = playerData.playerId;
        if (!gamePlayerMap[gameId]) {
            gamePlayerMap[gameId] = {};
        }
        gamePlayerMap[gameId][playerId] = playerData;
        return gamePlayerMap;
    }

    const signIn = ({access, refresh, userId}:{access: string, refresh: string, userId: string | undefined} ): boolean => {
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

    interface JwtUserId {
        access: string;
        refresh: string;
        userId?: string;
    }


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
    
// Send session user data when sessionId or userInfo changes
//     useEffect(() => {
//         if (sessionId) {
//             socket.handleSessionUser(sessionId, userInfo);
//         }
//     }, [sessionId, userInfo]);
    
    useEffect(() => {
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
    }, []);


    useEffect(() => {
        // Load stored data on mount
        const loadUserInfo = async () => {
            console.log("AppContext useEffect[] load('userInfo')")
            const storedUserInfo = await getStoredJSON('userInfo');
            if (storedUserInfo) {
                console.log(`Loaded stored user info:`, storedUserInfo);
                setUserInfo(storedUserInfo);
            }
        };
        const loadSeen = async () => {
            console.log("AppContext useEffect[] loadSeen")
            const storedSeen = await getStoredJSON('seen');
            if (storedSeen) {
                console.log(`Loaded stored seen:`, storedSeen);
                setJwtRefresh(storedSeen);
            }
        };

        loadSeen();
        loadUserInfo(); 
    }, []);

    useEffect(() => {
        console.log("AppContext useEffect[userInfo] setStoredJSON('userInfo')", userInfo)
        const saveData = async () => {
            await setStoredJSON('userInfo', userInfo);
        };
        if (userInfo) {
            saveData(); // Save data if userInfo changes
        }
    }, [userInfo]);

    useEffect(() => {
        console.log("AppContext useEffect[jwtRefresh] setStoredJSON('seen')", jwtRefresh)
        const saveData = async () => {
            await setStoredJSON('seen', jwtRefresh);
        };
        if (jwtRefresh) {
            saveData(); // Save data if userInfo changes
        }
    }, [jwtRefresh]);    
    
    useEffect(() => {
        // screens: tv/computer width: 1536 height: 826
        // mobile portrait: width: 412 height: 733
        const screenWidth = screenSize.width;
        const fontStyleLarge = screenWidth > 1500 ? styles.largeText : screenWidth < 500 ? styles.smallText : styles.mediumText;
        const fontStyleMedium = screenWidth > 1500 ? styles.mediumText : screenWidth < 500 ? styles.smallestText : styles.smallText;
        const fontStyleSmall = screenWidth > 1500 ? styles.smallText : styles.smallestText;
        setAppStyles({...styles,
            largeText: fontStyleLarge,
            mediumText: fontStyleMedium,
            smallText: fontStyleSmall,
        });
    }, [screenSize]);


    useEffect(() => {
        console.log(`appcontext useEffect [seen, sessionId]: ${jwtRefresh}/${sessionId}`);
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
                        console.log("AuthenticatedSessionId response:", response);
                        socket.handleSessionUser(sessionId, userInfo);
                    })
                    .catch((error) => {3
                        console.log("AuthenticatedSessionId failed:", error);
                        console.log("AuthenticatedSessionId status code:", error.response.status);
                        // if the response indicates that our token is expired, we can try to refresh it
                        handleRefresh();
                    });
            }
            else{
                console.log("AuthenticatedSessionId cannot be done; we should go back to home:")
            }
        }
    }, [ jwtRefresh, sessionId, currentGameId]);


    useEffect(() => {
        console.log("AppContext useEffect[currentGameId] startSocket(currentGameId)")
        
        if(currentGameId){
            socket.startSocket(currentGameId);
            setSessionId(generateSessionId());
        }

        return () => {
            socket.closeSocket(); // Clean up on component unmount
        };
    }, [currentGameId]);


    return (
        <AppContext.Provider
            value={{
                addPlayerToGame,
                appStyles,
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
