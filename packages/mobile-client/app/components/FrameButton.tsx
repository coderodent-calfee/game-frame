import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FrameButtonProps {
    title: string;
    onPress: () => void;
    width?: number; // Optional width
    height?: number; // Optional height
}

const FrameButton: React.FC<FrameButtonProps> = ({ title, onPress, width = 'auto', height = 'auto' }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { width, height }]}
            onPress={onPress}
        >
            <Text style={styles.buttonText} numberOfLines={1}>{title}</Text>
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
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        flexShrink: 1,
    },
});

export default FrameButton;
