import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

const UserNameComponent = ({ user, setUserName }: { user: { name: string | null }, setUserName: (info: { name: string }) => void }) => {
    
    const [nameInput, setNameInput] = useState<string>(user.name || '');
    useEffect(() => {
        setNameInput(user.name || ''); // Sync the input with user.name if available
    }, [user.name]);

    const handleNameChange = (text: string) => {
        console.log("handleNameChange:", text );
        
        setNameInput(text);
    };

    const handleNameSubmit = () => {
        setUserName({name : nameInput});
    };
    return (
        <View style={styles.container}>
            {
                <TextInput
                    style={styles.input}
                    value={nameInput}
                    onChangeText={handleNameChange}
                    onSubmitEditing={handleNameSubmit}
                    placeholder="Enter User Name"
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

export default UserNameComponent;
