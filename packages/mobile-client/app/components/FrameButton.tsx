import React, { forwardRef } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {useAppContext} from "@/utils/AppContext";

interface FrameButtonProps {
    title: string;
    onPress: () => void;
}



const FrameButton: React.FC<FrameButtonProps> = ({ title, onPress}, ref) => {
    const { screenSize, appStyles } = useAppContext();
    const frameButtonStyles = screenSize.width < 500 ? smallStyles : screenSize.width < 1500 ? styles : largeStyles;

    return (
        <TouchableOpacity ref={ref} style={frameButtonStyles.button} onPress={onPress} >
            <Text style={[frameButtonStyles.buttonText, appStyles.largeText ]} numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
    );
};

const smallStyles = StyleSheet.create({
    button: {
        margin: 6,
        borderRadius: 4,
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
const styles = StyleSheet.create({
    button: {
        margin: 8,
        borderRadius: 7,
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
const largeStyles = StyleSheet.create({
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
