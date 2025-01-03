import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import {useAppContext} from "@/utils/AppContext";

const UserNameComponent = ({ user, setUserName }: { user: { name: string | null }, setUserName: (info: { name: string }) => void }) => {
    const {appStyles } = useAppContext();

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
                    style={[styles.input, appStyles.largeText]}
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
    
    input: {
        margin: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
});

export default UserNameComponent;
