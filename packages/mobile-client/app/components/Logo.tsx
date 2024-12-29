import {Image, StyleSheet, View} from "react-native";
import rwcImage from "@/assets/images/rwc.png";
import React from "react";
import PageLayout from "@/app/components/PageLayout";

const Logo = () => {
    return (<View id="top-left-corner-icon" style={styles.icon}>
        <Image id="top-left-corner-image" source={rwcImage} style={styles.image} resizeMode="cover"/>
    </View>);
}
const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    },
    icon: {
        width: '100%',
        height: '100%',
    },
});

export default Logo;