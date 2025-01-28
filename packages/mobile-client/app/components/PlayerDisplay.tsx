import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { Svg, Circle, Rect } from "react-native-svg";
import {Player} from "@/utils/AppContext";

export interface PlayerDisplayProps {
    player: Player;
    onPress: () => void;
    playerNumber: number;
    size: number;
}

const PlayerDisplay  = (props:PlayerDisplayProps) => {

    const { player, onPress, size, playerNumber } = props; // Destructure props for clarity

    const buttonText = player.name; // Declare variables
    const overlayText = `Player ${playerNumber}`;

    
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* SVG Icon */}
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={(size - 10) / 2}
                    stroke="blue"
                    strokeWidth="5"
                    fill="lightblue"
                />
            </Svg>

            {/* Overlayed Text and Button */}
            <View style={[styles.overlay, { width: size }]}>
                <TouchableOpacity style={styles.button} onPress={props.onPress}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
                <Text style={styles.text}>{overlayText}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative", // Allows absolute positioning of the overlay
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)", // Optional overlay for contrast
        paddingVertical: 5,
    },
    text: {
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
    button: {
        marginTop: 5,
        backgroundColor: "blue",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default PlayerDisplay;