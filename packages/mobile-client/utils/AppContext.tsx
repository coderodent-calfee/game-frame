import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {handleSessionUser, startSocket} from "@/utils/socket"; // For React Native

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
    const [userInfo, setUserInfo] = useState<any>({});

    const storage = Platform.OS === 'web' ? localStorage : AsyncStorage;

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
                sessionId,
                setSessionId,
                userInfo,
                setUserInfo,
                getStoredJSON,
                setStoredJSON,
                getStoredString,
                setStoredString,
                removeStoredItem,
                addPlayerToGame
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
