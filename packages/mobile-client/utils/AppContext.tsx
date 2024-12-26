import React, { createContext, useContext, useState, useEffect } from 'react';
import {Platform} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // For React Native

// Define the shape of the context state
interface AppContextType {
    sessionId: string | null;
    setSessionId: (id: string | null) => void;
    playerInfo: any;
    setPlayerInfo: (info: any) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [playerInfo, setPlayerInfo] = useState<any>({});

    const storage = Platform.OS === 'web' ? localStorage : AsyncStorage;
    
    function generateSessionId(): string {
        const array = new Uint8Array(16); // 16 bytes = 128 bits
        crypto.getRandomValues(array); // Fill the array with secure random values
        return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(""); // Convert to hex
    }

    useEffect(() => {
        const loadData = async () => {
            const storedSessionId = await storage.getItem ? storage.getItem('sessionId') : localStorage.getItem('sessionId');
            if (storedSessionId) {
                setSessionId(storedSessionId);
            } else {
                const generatedSessionId = generateSessionId();
                setSessionId(generatedSessionId);
            }

            const storedPlayerInfo = await (storage.getItem ? storage.getItem('playerInfo') : JSON.parse(localStorage.getItem('playerInfo') || '{}'));
            if (storedPlayerInfo) {
                console.log(`loaded stored player ${storedPlayerInfo}`);
                setPlayerInfo(JSON.parse(storedPlayerInfo));
            }
        };

        loadData();  // Load stored data on mount
    }, []);
    
    useEffect(() => {
        const saveData = async () => {
            await (storage.setItem
                    ? storage.setItem('sessionId', sessionId || '')
                    : localStorage.setItem('sessionId', sessionId || '')
            );
            await (storage.setItem
                    ? storage.setItem('playerInfo', JSON.stringify(playerInfo))
                    : localStorage.setItem('playerInfo', JSON.stringify(playerInfo))
            );
        };

        if (sessionId && playerInfo) {
            saveData();  // Save data if sessionId or playerInfo changes
        }
    }, [sessionId, playerInfo]);
    
    return (
        <AppContext.Provider className="myContext" value={{ sessionId, setSessionId, playerInfo, setPlayerInfo }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook for accessing the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
