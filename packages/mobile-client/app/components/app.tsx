import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, TextInput, View, Image } from "react-native";
import GameId from "@/app/components/GameId";
import rwcImage from '../../assets/images/rwc.png'
import clientLog from "@/utils/clientLog";


const App: React.FC = () => {
    const [input, setInput] = useState<string>('');

    const handleChangeText = (text: string) => {
        const newInput = input + ` hct ${text}`
        console.error(`handleChangeText ${text}`);
        setInput(newInput);
    };

    const handleChange = (e: any) => {
        const value = e.target.value;
        console.error(`handleChange ${value}`);
        const newInput = input + ` hc ${value}`
        setInput(newInput);
    };

    const handleKeyPress = (e: any) => {
        const key = e.nativeEvent.key;
        console.error(`handleKeyPress ${key}`);
        const newInput = input + ` hkp ${key}`
        setInput(newInput);
    };
    
    
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
                    <TextInput style={styles.input}
                               onChange={(e) => handleChange(e)}
                               onChangeText={(text) => handleChangeText(text)}
                               onKeyPress={(e) => handleKeyPress(e)}
                               keyboardType="default"
                    />
                    <Text  style={styles.input}>{input}</Text>
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
        justifyContent: 'center',
        fontSize: 10 + 2 * Math.min(Dimensions.get('window').width, Dimensions.get('window').height) / 100,
        color: 'white', // Text color is set in `Text`, not the container
        width: '100%',
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
        maxWidth: Dimensions.get('window').width/4,
        width: 100,  // Specify the width of the image
        height: 100, // Specify the height of the image
    },
    icon: {
        gridArea: 'icon',
        width: '100%',
        boxSizing: 'border-box',        
    },
    input: {
        fontSize: 30,
        borderWidth: 2,
        margin: 5,
        borderRadius: 10,
        textAlign: 'center',
        color: 'white',
    },
});

export default App;


