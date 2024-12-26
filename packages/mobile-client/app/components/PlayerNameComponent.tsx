import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

const PlayerNameComponent = ({ player, setPlayerInfo }: { player: { name: string | null }, setPlayerInfo: (info: { name: string }) => void }) => {
    const [nameInput, setNameInput] = useState<string>(player.name || '');

    useEffect(() => {
        setNameInput(player.name || ''); // Sync the input with player.name if available
    }, [player.name]);

    const handleNameChange = (text: string) => {
        console.log("handleNameChange:", text );
        
        setNameInput(text);
    };

    const handleNameSubmit = () => {
        console.log("handleNameSubmit:", nameInput );
        if (nameInput.trim()) {
            setPlayerInfo((prevState) => ({...prevState, name: nameInput}));
        }
    };
    return (
        <View style={styles.container}>
            {
                <TextInput
                    style={styles.input}
                    value={nameInput}
                    onChangeText={handleNameChange}
                    onSubmitEditing={handleNameSubmit}
                    placeholder="Enter Player Name"
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    text: {
        color: 'white',
        fontSize: 30,
    },
    input: {
        margin: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        color: 'white',
        fontSize: 30,
    },
});

export default PlayerNameComponent;
