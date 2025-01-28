import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import {useAppContext} from "@/utils/AppContext";

interface User {
  name: string | null;
}

interface UserNameComponentProps {
    user: User;
    setUserName: (info: { name: string }) => void;
    placeholder?: string;
    secure?: boolean;
}

// Main component
const UserNameComponent = ({ user, setUserName, placeholder, secure }: UserNameComponentProps) => {
    const { screenSize, appStyles } = useAppContext();
    const userNameComponentStyles = screenSize.width < 500 ? smallStyles : screenSize.width < 1500 ? styles : largeStyles;

    const [nameInput, setNameInput] = useState<string>(user.name || '');
    const [sentInput, setSentInput] = useState<string>(user.name || '');
    useEffect(() => {
        setNameInput(user.name || ''); // Sync the input with user.name if available
    }, [user.name]);

    const handleNameChange = (text: string) => {
        setNameInput(text);
    };

    const handleNameSubmit = () => {
        if(nameInput != sentInput){
            setUserName({ name: nameInput });
            setSentInput(nameInput);
        }
    };
    return (
        <View>
            {
                <TextInput
                    style={[userNameComponentStyles.input, appStyles.largeText]}
                    value={nameInput}
                    onChangeText={handleNameChange}
                    onSubmitEditing={handleNameSubmit}
                    onBlur={handleNameSubmit}
                    placeholder={placeholder ?? "Enter User Name"}
                    secureTextEntry={ secure }
                />
            }
        </View>
    );
};

const smallStyles = StyleSheet.create({

    input: {
        margin: 6,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
});
const styles = StyleSheet.create({

    input: {
        margin: 8,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
});
const largeStyles = StyleSheet.create({

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
