﻿import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";

import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {Link, Redirect, useRouter} from "expo-router";
import Logo from "@/app/components/Logo";
import {makeGetRequest, makePostRequest} from "@/utils/requester";
import {useAppContext} from "@/utils/AppContext";
import UserNameComponent from "@/app/components/UserNameComponent";


// todo: put these in one place
interface Player {
    playerId: string;
    name: string;
    gameId: string;
}

interface GameType {
    gameId: string;
    players: Player[];
    status: string;
    minPlayers: number;
    maxPlayers: number;
}

interface GameInfoType {
    game: GameType;
    player?: Player;
}

// Looking for a Game by putting in a GameId
export default function Index() {
    const [game, setGame] = useState<GameType | undefined>();
    const [gameId, setGameId] = useState<string>();
    const { sessionId, userInfo, setUserInfo ,screenSize, appStyles } = useAppContext();
    const [editUser, setEditUser] = useState<boolean>(false);
    const router = useRouter();

    const toggleEditUser = () => {
        setEditUser((prevState) => !prevState);
    };

    const handleUserName = (info)=>{
        console.warn("handleUserName ", info);
        setUserInfo((prevState) => ({ ...prevState, ...info }));
    };

    useEffect(() => {
        console.log(`useEffect gameId ${gameId} len ${gameId?.length}`);
        if (!gameId || gameId.length !== 6) {
            return;
        }
        makeGetRequest<GameInfoType>(`api/game/${gameId}/info`, new URLSearchParams({gameId}))
            .then((response) => {
                if(!response.game){
                    return;
                }
                setGame(response.game);
            }).catch((error) => {
                console.log("GameInfo failed:", error);
            }
        );
    }, [gameId]);
    
    useEffect(() => {
        console.log(`useEffect game` , game);
        if(!game || !gameId || gameId.length !== 6){
            return;
        }
        makePostRequest<UserType>(`api/game/${gameId}/join`, {sessionId})
            .then((response) => {
                console.log("joinGame response:", response);
                router.navigate(`game/${gameId}/`, {key:"JoinGame"}); // key still needed?
            }).catch((error) => {
                console.log("joinGame failed:", error)
            }
        );
    }, [game]);
    
    
    if(game){
        return  <Redirect href={`/game/${game.gameId}/`}/>;
    }
    return (

        <PageLayout
            cornerSize={screenSize.corner}
            topLeftCorner={<Logo id="top-left-corner-icon"/>}

            leftSideContent={
                userInfo.name &&
                <View style={appStyles.columnFlow}>
                    <FrameButton title={userInfo.name} onPress={toggleEditUser}></FrameButton>
                </View>
            }
            // topContent={
            //     <View style={styles.rowFlow}>
            //         <Link href={"/game/index"} asChild>
            //             <FrameButton title="Lobby" onPress={console.log("Lobby")}></FrameButton>
            //         </Link>
            //     </View>
            // }
            topRightCorner={<Text style={appStyles.largeText}>Right Corner</Text>}

            
            centralContent={
                <View style={appStyles.columnFlow}>
                    <GameId setGameId={setGameId}/>
                    {editUser && <UserNameComponent user={userInfo} setUserName={handleUserName}/>}
                    
                    
                </View>
            }
            bottomContent={
                <View style={appStyles.columnFlow}>
                    <Text style={[appStyles.largeText]}>width: {screenSize.width} height: {screenSize.height}</Text>

                </View>}
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
});

