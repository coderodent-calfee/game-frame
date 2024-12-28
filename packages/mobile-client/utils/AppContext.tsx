import React, { createContext, useContext, useState, useEffect } from 'react';
import {Platform} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // For React Native

// Define the shape of the context state
interface AppContextType {
    sessionId: string | null;
    setSessionId: (id: string | null) => void;
    userInfo: any;
    setUserInfo: (info: any) => void;
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

    useEffect(() => {
        const loadData = async () => {
            const storedUserInfo = await (storage.getItem ? storage.getItem('userInfo') : JSON.parse(localStorage.getItem('userInfo') || '{}'));
            if (storedUserInfo) {
                console.log(`loaded stored player ${storedUserInfo}`);
                setUserInfo(JSON.parse(storedUserInfo));
            }
        };

        loadData();  // Load stored data on mount
    }, []);
    
    useEffect(() => {
        const saveData = async () => {
            await (storage.setItem
                    ? storage.setItem('userInfo', JSON.stringify(userInfo))
                    : localStorage.setItem('userInfo', JSON.stringify(userInfo))
            );
        };

        if (userInfo) {
            saveData();  // Save data if sessionId or userInfo changes
        }
    }, [userInfo]);
    
    return (
        <AppContext.Provider className="myContext" value={{ sessionId, setSessionId, userInfo: userInfo, setUserInfo: setUserInfo }}>
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
