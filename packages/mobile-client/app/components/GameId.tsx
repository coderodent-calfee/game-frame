import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Rainbow colors for each character
const colors = ['#FF0000', '#FF7F00', '#CCCC00', '#00FF00', '#0000FF', '#4B0082'];

interface GameIdProps {
    gameId?: string;
}

const GameId: React.FC<GameIdProps> = ({ gameId }) => {
    const [input, setInput] = useState<string[]>(new Array(6).fill(''));

    // Update input when gameId is provided
    useEffect(() => {
        if (gameId && gameId.length === 6) {
            setInput(gameId.split(''));
        }
    }, [gameId]);

    const handleChange = (text: string, index: number) => {
        console.warn(`handleChange ${input} => ${text}`);
    };
    
    const handleKeyPress = (e: any, index: number) => {
        // Detect if the key pressed is a valid character
        const key = e.nativeEvent.key;
        if (key.length === 1 && /[A-Z0-9]/.test(key.toUpperCase())) {
            const updatedInput = [...input];
            updatedInput[index] = key.toUpperCase(); // Enforce uppercase
            setInput(updatedInput);

            // Move to the next input if this one is filled
            if (index < 5) {
                const nextInput = document.getElementById(`input-${index + 1}`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        } else if (key === 'Backspace' || key === 'ArrowLeft') {
            // If backspace or left arrow, focus on the previous input
            if (index > 0) {
                const prevInput = document.getElementById(`input-${index - 1}`);
                if (prevInput) {
                    prevInput.focus();
                }
            }
        }
    };
    return (
        <View style={styles.container}>
            {input.map((char, index) => (
                gameId ? (
                    // If gameId is provided, show the rainbow-colored character
                    <View
                        key={index}
                        style={[styles.fixedBox, { backgroundColor: colors[index] }]}>
                        <Text style={styles.fixedText}>{char || '-'}</Text>
                    </View>
                ) : (
                    <TextInput
                        key={index}
                        id={`input-${index}`}
                        style={[styles.input, { borderColor: colors[index] }]}
                        maxLength={1}
                        value={char}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="default"
                        textAlign="center"
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

export default GameId;
