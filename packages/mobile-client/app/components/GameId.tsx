import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import clientLog from '../../utils/clientLog';
import {useAppContext} from "@/utils/AppContext";

// Rainbow colors for each character
const colors = ['#FF0000', '#FF7F00', '#CCCC00', '#00CC00', '#0000FF', '#4B0082'];

interface GameIdProps {
    setGameId? : (id:string) => void;
    gameId?: string;
}

const GameId: React.FC<GameIdProps> = ({ gameId, setGameId }) => {
    const [display, setDisplay] = useState<string[]>(new Array(6).fill(''));
    const [input, setInput] = useState<string[]>(new Array(6).fill(''));
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const { screenSize, appStyles } = useAppContext();

    console.log(`render input ${input}`);


    useEffect(() => {

        const possibleGameId = display.join("");

        console.log(`useEffect possibleGameId ${possibleGameId} len ${possibleGameId.length}`);
        if(setGameId && possibleGameId && possibleGameId.length ){
            setGameId(possibleGameId);
        }
        
    }, [display]);

    // Update input when gameId is provided
    useEffect(() => {
        if (gameId && gameId.length === 6) {
            setDisplay(gameId.split(''));
        }
    }, [gameId]);

    const handleInput = (newValue: string, index : number) => {
        const lastChar = newValue.slice(-1);
        if (false === /[A-Z0-9]/.test(lastChar.toUpperCase())) {
            return;
        }
        console.log(`handleInput ${input} at ${index} <= ${lastChar}`);
        const newInput = [...input];
        newInput[index] = lastChar.toUpperCase();
        setInput(newInput);
        handleDebouncedUpdate(newInput, index);
    };
    
    const handleDebouncedUpdate = (newInput: string[], index : number) => {
        if (debounceTimer.current) {
            // If debounce is already in flight, do nothing
            return;
        }
        console.log(`handleDebouncedUpdate input ${input} newInput ${newInput} index ${index}`);
        const move = () => {        // Move to the next input if this one is filled
            if (index < 5) {
                const nextInput = document.getElementById(`input-${index + 1}`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        };
        // Set the debounce timer
        debounceTimer.current = setTimeout(() => {
            debounceTimer.current = null; // Reset debounce
            console.log(`timeout display ${display} input ${input}`);
            setDisplay(newInput);
            move();
        }, 150); // Adjust delay as needed
    };

    const handleChange = (e: any, index:number) => {
        const newValue = e.target.value;
        console.log(`handleChange ${input} at ${index} <= ${newValue}`);
        handleInput(newValue, index);        
    };
    
    // on the TV this is the _only_ callback
    // on the mobile e.nativeEvent.key is Undefined (Backspace works)
    // on the web this is called first
    const handleKeyPress = (e: any, index: number) => {
        const key = e.nativeEvent.key;
        console.warn(`handleKeyPress ${e.nativeEvent.key} at ${index}`);
        const inputElement = document.getElementById(`input-${index}`);
        inputElement.value = "";
        if(key.len !== 1){
            return;
        }
        const newValue = `${key}`;
        handleInput(newValue, index);

    };
    const gameIdStyles= screenSize.width < 500 ? smallStyles : styles ;
    
    return (
        <View style={styles.container}>
            {display.map((char, index) => (
                gameId ? (
                    // If gameId is provided, show the rainbow-colored character
                    <View
                        key={index}
                        style={[gameIdStyles.fixedBox, { backgroundColor: colors[index] }]}>
                        <Text style={gameIdStyles.fixedText}>{char || '-'}</Text>
                    </View>
                ) : (
                    <TextInput
                        key={index}
                        id={`input-${index}`}
                        style={[gameIdStyles.input, { borderColor: colors[index] }]}
                        onChange={(e) => handleChange(e, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="default"
                        textAlign="center"
                        // not sure these work right
                        // maxLength={1}
                        value={char}
                        
                    />
                )
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    input: {
        width: 50,
        height: 50,
        fontSize: 30,
        borderWidth: 2,
        margin: 5,
        borderRadius: 10,
        textAlign: 'center',
        color: 'white',
    },
    fixedBox: {
        width: 50,
        height: 50,
        margin: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fixedText: {
        fontSize: 30,
        color: 'white',
    },
});

const smallStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    input: {
        width: 40,
        height: 40,
        fontSize: 30,
        borderWidth: 2,
        margin: 5,
        borderRadius: 10,
        textAlign: 'center',
        color: 'white',
    },
    fixedBox: {
        width: 40,
        height: 40,
        margin: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fixedText: {
        fontSize: 20,
        color: 'white',
    },
});
export default GameId;
