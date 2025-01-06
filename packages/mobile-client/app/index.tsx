import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from "react-native";

import FrameButton from "@/app/components/FrameButton";
import PageLayout from "@/app/components/PageLayout";
import {Player, useAppContext} from "@/utils/AppContext";
import UserNameComponent from "@/app/components/UserNameComponent";
import {socket, startSocket, handleSessionUser} from '@/utils/socket';
import {makePostRequest} from '@/utils/requester'
import {useNavigation} from "@react-navigation/native";

import {Link, useRouter} from "expo-router";
import Logo from "@/app/components/Logo";

interface GameType {
    gameId: string;
}

interface UserType {
    playerId: string;
}

export default function Index() {
    const {appStyles, sessionId, userInfo, setUserInfo, getStoredJSON, setStoredJSON, addPlayerToGame,screenSize } = useAppContext();
    const [editUser, setEditUser] = useState<boolean>(true);
    //const navigation = useNavigation();
    const router = useRouter();
    
    const toggleEditUser = () => {
        setEditUser((prevState) => !prevState);
    };
    

    useEffect(() => {
        console.log(`useEffect editUser:${editUser} userInfo:`, userInfo);
        if (userInfo.name) {
            setEditUser(false);
        }
    }, [userInfo]);


    
    const resetUser = () => {
        console.log(`reset User:`);
        setUserInfo({});
        setEditUser(true);
    };
    
    const generateId = (): string => {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    
    const handleUserName = (info)=>{
        if(userInfo && !userInfo.userId){
            info.userId = generateId(); 
        }
        console.warn("handleUserName ", info);
        setUserInfo((prevState) => ({ ...prevState, ...info }));
    };

    const addGamePlayer = async (gameId : string, playerInfo : Player): Promise<void> => {
        const storedGamePlayerInfo = await getStoredJSON('gamePlayer');
        const gamePlayerInfo = addPlayerToGame(gameId, playerInfo, storedGamePlayerInfo || {});
        console.log("gamePlayerInfo: ", gamePlayerInfo);
        return setStoredJSON('gamePlayer', gamePlayerInfo).then(()=>gamePlayerInfo) ;
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
                const playerInfo = response['player'];
                addGamePlayer(gameId, playerInfo).then(()=>{
                    router.navigate(`game/${gameId}/`, {key:"JoinGame"}); // key still needed?
                });
            }).catch((error) => {
                console.log("newGame failed:", error)
        });
    }
    
    
    return (
        <PageLayout
            cornerSize={screenSize.corner}
            topLeftCorner={<Logo id="top-left-corner-icon"/>}
            topContent={
                userInfo.name && userInfo.name.length && 
                <View style={appStyles.rowFlow}>
                    <Link href="/game" asChild>
                        <FrameButton title="Look For Game" onPress={() => {
                        }}></FrameButton>
                    </Link>

                    <FrameButton title="New Game" onPress={newGame}></FrameButton>


                </View>

            }
            topRightCorner={<Text style={appStyles.largeText}>Right Corner</Text>}
            leftSideContent={
                userInfo.name &&
                <View style={appStyles.columnFlow}>
                    <FrameButton title={userInfo.name} onPress={toggleEditUser}></FrameButton>
                </View>
            }
            centralContent={
                <View style={appStyles.columnFlow}>
                    {editUser && <UserNameComponent user={userInfo} setUserName={handleUserName}/>}
                    {editUser && <FrameButton title="Reset User" onPress={resetUser}></FrameButton>}
                    {!userInfo.name &&
                        <Text style={appStyles.mediumText}>Every User Must Have A Name</Text>}
                </View>
            }
            bottomContent={
                <View style={appStyles.columnFlow}>

                    <Text style={[appStyles.largeText]}>width: {screenSize.width} height: {screenSize.height}</Text>
                    <Text style={[appStyles.smallText]}>{sessionId}</Text>
                </View>
            }
        />
    );
}


