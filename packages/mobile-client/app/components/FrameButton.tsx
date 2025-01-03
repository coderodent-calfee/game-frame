import React, { forwardRef } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {useAppContext} from "@/utils/AppContext";

interface FrameButtonProps {
    title: string;
    onPress: () => void;
}

const FrameButton: React.FC<FrameButtonProps> = ({ title, onPress}, ref) => {
    const {appStyles } = useAppContext();

    return (
        <TouchableOpacity ref={ref} style={styles.button} onPress={onPress} >
            <Text style={[styles.buttonText, appStyles.largeText ]} numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        margin: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4B0082', // Indigo
        borderWidth: 2,
        borderColor: 'white',
    },
    buttonText: {
        marginRight: 2,
        marginLeft: 2, 
        flexShrink: 1,
    },
});

export default forwardRef(FrameButton);
