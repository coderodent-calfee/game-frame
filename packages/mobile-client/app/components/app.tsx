import React from 'react';
import {Dimensions, StyleSheet, Text, View, Image } from "react-native";
import GameId from "@/app/components/GameId";
import rwcImage from '../../assets/images/rwc.png'


const App: React.FC = () => {
    return (
        <View style={styles.header}>
            <View className="App-header grid-container" style={styles.container}>

                <View className="icon" style={styles.icon}>

                    <a className="App-link" href="https://www.linkedin.com/in/robert-w-calfee/" target="_blank"
                       rel="noopener noreferrer">
                        <Image source={rwcImage} style={styles.image} />
                    </a> 
                </View>
                <View className="header">
                </View>
                <View className="navigation">
                </View>
                <View className="content">
                    <GameId gameId="AB12CD"/>
                    <GameId/>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#282c34',
        minHeight: Dimensions.get('window').height,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
//        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10 + 2 * Math.min(Dimensions.get('window').width, Dimensions.get('window').height) / 100,
        color: 'white', // Text color is set in `Text`, not the container
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    top: { flex: 1, backgroundColor: 'lightblue' },
    middle: { flex: 4, flexDirection: 'row' },
    left: { flex: 1, backgroundColor: 'lightgreen' },
    center: { flex: 2, backgroundColor: 'lightcoral' },
    right: { flex: 1, backgroundColor: 'lightgoldenrodyellow' },
    bottom: { flex: 1, backgroundColor: 'lightgrey' },
    image: {
        width: 200,  // Specify the width of the image
        height: 200, // Specify the height of the image
        resizeMode: 'contain', // Ensures the image scales properly within the specified dimensions
    },
    icon: {
        gridArea: 'icon',
        width: '100%',
        boxSizing: 'border-box',        
    },
});

export default App;
