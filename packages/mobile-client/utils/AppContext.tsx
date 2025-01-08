import React, { createContext, useContext, useState, useEffect } from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleSessionUser, startSocket} from "@/utils/socket"; 


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

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [sessionId, setSessionId] = useState<string>(generateSessionId());
    const [token, setToken] = useState<string>();
    const [jwtRefresh, setJwtRefresh] = useState<string>();
    const [userInfo, setUserInfo] = useState<any>({});
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


    useEffect(() => {
        const handleResize = () => {
            setScreenSize(figureScreenSize);
        };
        
        Dimensions.addEventListener('change', handleResize);

        return () => {
            Dimensions.removeEventListener('change', handleResize);
        };
    }, []);
    const storage = Platform.OS === 'web' ? localStorage : AsyncStorage;

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

    const signIn = ({access, refresh, userId}:{access: string, refresh: string, userId: string | undefined} ): boolean => {
        setToken(access);
        setJwtRefresh(refresh);
        setUserInfo((prevState) => { return { ...prevState, userId: userId }; });
        return userId !== undefined;
    };

    // todo: there must be more to do here
    const signOut = (): void => {
        setToken(undefined);
    };

    function generateSessionId(): string {
        const array = new Uint8Array(16); // 16 bytes = 128 bits
        crypto.getRandomValues(array); // Fill the array with secure random values
        return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(""); // Convert to hex
    }

    const getStoredJSON = async (key: string): Promise<object | null> => {
        return getStoredString(key).then(info => info && JSON.parse(info));
    };

    const setStoredJSON = async (key: string, value: object): Promise<void> => {
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

    useEffect(() => {
        const loadData = async () => {
            const storedUserInfo = await getStoredJSON('userInfo');
            if (storedUserInfo) {
                console.log(`Loaded stored user info: ${storedUserInfo}`);
                setUserInfo(storedUserInfo);
            }
        };

        loadData(); // Load stored data on mount
    }, []);

    useEffect(() => {
        const saveData = async () => {
            await setStoredJSON('userInfo', userInfo);
        };
        if (userInfo) {
            saveData(); // Save data if userInfo changes
        }
    }, [userInfo]);
    
    // Client socket communication
    useEffect(startSocket, []);

    useEffect(() => {
        handleSessionUser(sessionId, userInfo);
    }, [sessionId, userInfo]);

    return (
        <AppContext.Provider
            value={{
                token, 
                signIn, signOut,
                sessionId, setSessionId,
                userInfo,  setUserInfo,
                getStoredJSON, setStoredJSON,
                getStoredString, setStoredString,
                removeStoredItem,
                addPlayerToGame,
                screenSize,
                appStyles
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
