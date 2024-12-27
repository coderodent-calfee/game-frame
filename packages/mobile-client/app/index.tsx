import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";

import rwcImage from "@/assets/images/rwc.png";
import FrameButton from "@/app/components/FrameButton";
import PageLayout from "@/app/components/PageLayout";
import {useAppContext} from "@/utils/AppContext";
import PlayerNameComponent from "@/app/components/PlayerNameComponent";
import socket from '../utils/socket';
import {makePostRequest} from '../utils/requester'
import {useNavigation} from "@react-navigation/native";
import {Link} from "expo-router";

interface GameType {
    gameId: string;
}

interface PlayerType {
    playerId: string;
}

export default function Index() {
    const {sessionId, playerInfo, setPlayerInfo} = useAppContext();
    const [editPlayer, setEditPlayer] = useState<boolean>(true);
    const navigation = useNavigation();

    const toggleEditPlayer = () => {
        setEditPlayer((prevState) => !prevState);
    };

    // Client socket communication
    useEffect(() => {
        // When the client connects to the server
        socket.on('connect', () => {
            console.log('Connected with socket ID:', socket.id);
        });
        socket.on('message', (data) => {
            console.log(`Received message:`, data);
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('message');
        };
    }, []);
    useEffect(() => {
        // When the client connects to the server
        console.log(`sessionId: ${sessionId}`);
        socket.emit('clientConnected', {sessionId});
    }, [sessionId]);

    useEffect(() => {
        console.log(`useEffect editPlayer:${editPlayer} playerInfo.name:${playerInfo.name}`)
        if (playerInfo.name) {
            setEditPlayer(false);
        }
    }, [playerInfo]);

    const sendMessage = () => {
        const message = `Hello from ${sessionId}`;
        console.log(`sendMessage: ${message}`)
        socket.emit('clientMessage', {message});
    };

    const handlePlayerName = (info)=>{
        console.warn("handlePlayerName ", info);
        setPlayerInfo((prevState) => ({ ...prevState, ...info }));
    };
    
    // const newGame = () => {
    //     console.log(`newGame`);
    //     if (!sessionId) {
    //         console.warn(`newGame: no sessionId`);
    //         return;
    //     }
    //     makePostRequest<GameType>('api/game/newGame', {sessionId})
    //         .then((gameId) => {
    //             console.log("newGame created:", gameId);
    //             return makePostRequest<PlayerType>('api/game/joinGame', {gameId});
    //         })
    //         .then((playerId) => {
    //             console.log("joinGame response:", playerId);
    //         }).catch((error) => {
    //         console.log("newGame failed:", error)
    //     });
    // }
    return (
        <PageLayout
            cornerSize={120}
            topLeftCorner={<View style={styles.icon}>
                <Image source={rwcImage} style={styles.image}/>
            </View>}
            topContent={
                playerInfo.name && playerInfo.name.length && 
                <View style={styles.rowFlow}>
                    <Link href="/lfg" asChild>
                        <FrameButton title="Look For Game" onPress={() => {
                        }}></FrameButton>
                    </Link>

                    <Link href="/lobby" asChild>
                        <FrameButton title="Lobby" onPress={() => {
                        }}></FrameButton>
                    </Link>

                    <FrameButton title="Send" onPress={sendMessage}></FrameButton>

                </View>

            }
            topRightCorner={<Text style={styles.text}>Right Corner</Text>}
            leftSideContent={
                playerInfo.name &&
                <View style={styles.columnFlow}>
                    <Text style={styles.text}>Player:</Text>
                    <FrameButton title={playerInfo.name} onPress={toggleEditPlayer}></FrameButton>
                </View>
            }
            centralContent={
                <View style={styles.columnFlow}>
                    {editPlayer && <PlayerNameComponent player={playerInfo} setPlayerName={handlePlayerName}/>}
                    {!playerInfo.name &&
                        <Text style={styles.text}>Every Player Must Have A Name</Text>}
                </View>
            }
            bottomContent={<Text style={[styles.text, {fontSize: 30}]}>{sessionId}</Text>}
        />
    );
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: 30,
    },
    image: {
        flex: 1,
    },
    icon: {
        flex: 1,
    },
    rowFlow: {
        flex: 1,
        flexDirection: 'row',
    },
    columnFlow: {
        flex: 1,
        flexDirection: 'column',
    },
});

