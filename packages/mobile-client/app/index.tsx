import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";

import rwcImage from "@/assets/images/rwc.png";
import FrameButton from "@/app/components/FrameButton";
import PageLayout from "@/app/components/PageLayout";
import {useAppContext} from "@/utils/AppContext";
import UserNameComponent from "@/app/components/UserNameComponent";
import socket from '@/utils/socket';
import {makePostRequest} from '@/utils/requester'
import {useNavigation} from "@react-navigation/native";
import {Link, useRouter} from "expo-router";

interface GameType {
    gameId: string;
}

interface UserType {
    playerId: string;
}

export default function Index() {
    const {sessionId, userInfo, setUserInfo} = useAppContext();
    const [editUser, setEditUser] = useState<boolean>(true);
    //const navigation = useNavigation();
    const router = useRouter();
    
    const toggleEditUser = () => {
        setEditUser((prevState) => !prevState);
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
        if(!sessionId){ return; }
        
        const sessionUserData : {sessionId:string, userName?:string} = {};
        sessionUserData.sessionId = sessionId;
        
        // todo: send all the user information
        if(userInfo.name && userInfo.name.length){
            sessionUserData.userName = userInfo.name;
        }
        socket.emit('sessionUser', sessionUserData);
    }, [sessionId]);

    useEffect(() => {
        console.log(`useEffect editUser:${editUser} userInfo.name:${userInfo.name}`)
        if (userInfo.name) {
            setEditUser(false);
        }
    }, [userInfo]);

    const sendMessage = () => {
        const message = `Hello from ${sessionId}`;
        console.log(`sendMessage: ${message}`)
        socket.emit('clientMessage', {message});
    };

    const handleUserName = (info)=>{
        console.warn("handleUserName ", info);
        setUserInfo((prevState) => ({ ...prevState, ...info }));
    };
    
    const newGame = () => {
        console.log(`newGame`);
        if (!sessionId) {
            console.warn(`newGame: no sessionId`);
            return;
        }
        makePostRequest<GameType>('api/game/newGame', {sessionId})
            .then((response) => {
                console.log("newGame created:", response);
                const gameId = response['game'].gameId;
                return makePostRequest<UserType>(`api/game/${gameId}/join`, {sessionId});
            })
            .then((response) => {
                console.log("joinGame response:", response);
                const gameId = response['game'].gameId;
                console.log("userInfo: ", userInfo);
                
                router.navigate(`game/${gameId}/`, {key:"Howdy"});
            }).catch((error) => {
                console.log("newGame failed:", error)
        });
    }
    return (
        <PageLayout
            cornerSize={120}
            topLeftCorner={<View id="top-left-corner-icon" style={styles.icon}>
                <Image  id="top-left-corner-image" source={rwcImage} style={styles.image}/>
            </View>}
            topContent={
                userInfo.name && userInfo.name.length && 
                <View style={styles.rowFlow}>
                    <Link href="/game" asChild>
                        <FrameButton title="Look For Game" onPress={() => {
                        }}></FrameButton>
                    </Link>

                    <FrameButton title="New Game" onPress={newGame}></FrameButton>

                    <FrameButton title="Send" onPress={sendMessage}></FrameButton>

                </View>

            }
            topRightCorner={<Text style={styles.text}>Right Corner</Text>}
            leftSideContent={
                userInfo.name &&
                <View style={styles.columnFlow}>
                    <Text style={styles.text}>User:</Text>
                    <FrameButton title={userInfo.name} onPress={toggleEditUser}></FrameButton>
                </View>
            }
            centralContent={
                <View style={styles.columnFlow}>
                    {editUser && <UserNameComponent user={userInfo} setUserName={handleUserName}/>}
                    {!userInfo.name &&
                        <Text style={styles.text}>Every User Must Have A Name</Text>}
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

