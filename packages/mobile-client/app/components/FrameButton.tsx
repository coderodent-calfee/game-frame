import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FrameButtonProps {
    title: string;
    onPress: () => void;
    width?: number; // Optional width
    height?: number; // Optional height
}

const FrameButton: React.FC<FrameButtonProps> = ({ title, onPress, width = 100, height = 50 }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { width, height }]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
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
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default FrameButton;
