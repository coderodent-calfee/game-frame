import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";
import { useLocalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';

import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {Link} from "expo-router";
import {Player, useAppContext} from "@/utils/AppContext";
import Logo from "@/app/components/Logo";
import {makeGetRequest, makePostRequest} from "@/utils/requester";
import socket from "@/utils/socket";
import PlayerDisplay, {PlayerDisplayProps} from "@/app/components/PlayerDisplay";
import UserNameComponent from "@/app/components/UserNameComponent";

interface PlayerInfo {
    [playerId: string]: any;
}

export interface Player {
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
    player?: Player[];
}

export default function Game() {
    const {
        token, 
        screenSize, 
        appStyles, 
        sessionId, 
        userInfo, 
        getStoredJSON,
        currentGameId, setCurrentGameId,
    } = useAppContext();
    const [gamePlayerState, setGamePlayerState] = useState<string>("Looking for Player");
    const [game, setGame] = useState<GameType | undefined>();
    const [player, setPlayer] = useState<Player | undefined>();
    const [editUser, setEditUser] = useState<boolean>(true);

    const toggleEditUser = () => {
        setEditUser((prevState) => !prevState);
    };

    const sendMessage = (message : string) => {
        console.log(`sendMessage: ${message}`);
        socket.clientMessage({message});
    };
    const { gameId } = useLocalSearchParams<{ gameId: string }>();
    console.log(`according to useLocalSearchParams in gameId: ${gameId}`);

    useEffect(() => {
        console.log(`useEffect [gameId]:`, gameId);
        setCurrentGameId(gameId);
    }, [gameId, token]);
    
    useEffect(() => {
        console.log(`useEffect editUser:${editUser} userInfo:`, userInfo);
        if (userInfo.name) {
            setEditUser(false);
        }
    }, [userInfo]);

    const handleUserName = (info)=>{
        console.warn("handleUserName ", info);
        if(!player){
            return;
        }
        makePostRequest<GameInfoType>({
                path: `api/game/${gameId}/setPlayerName/`,
                token,
                params:{
                    playerName : info["name"], 
                    playerId : player.playerId
                }
            })
            .then((response) => {
                console.log("setPlayerName response:", response);
                setEditUser(false);
                if(player.playerId === response.player?.playerId){
                    setPlayer(response.player);
                    sendMessage(`from:${player.playerId}\ngetGameInfo`);
                }

            }).catch((error) => {
                console.log("setPlayerName failed:", error)
            }
        );
        
    };

    const isEmpty = (obj: object): boolean => {
        return Object.keys(obj).length === 0;
    };

    
    useEffect(()=>{
        console.log(`useEffect: [token, sessionId] to get game info and player id`);
        if(gameId && token && sessionId){
            makeGetRequest<GameInfoType>({
                path : `api/game/${gameId}/info`,
                token,
                params : {
                    sessionId: sessionId
                }
            })
                .then((response) => {
                    if(!response.game){
                        console.log("no game?!:");
                        // why is it not error status?
                        // todo: navigate away from here: no game exists
                    }
                    console.log("GameInfo response:", response);
                    setGame(response.game);

                    if(response.player){
                        console.log("my player(s):", response.player);
                        if(response.player.length == 1){
                            setPlayer(response.player[0]);
                        }
                    }
                    else {
                        console.log("no response.player:", game);
                    }
                }).catch((error) => {
                    console.log("GameInfo failed:", error);
                }
            );
        }
        // in point of fact; we should just ask the server what our playerId is

    }, [gameId, token, sessionId]);

    
    const  playerDisplayProps :PlayerDisplayProps = {
        size: screenSize.corner,
        player,
        onPress :()=>{},
    };
    
    return (
        <PageLayout
            cornerSize={screenSize.corner}
            topLeftCorner={
            <View>
                {player && <PlayerDisplay player={player} onPress={toggleEditUser} size={screenSize.corner} playerNumber={1}/>}
                {!player && <Logo id="top-left-corner-icon"/>}
            </View>


            }
            topContent={
                <View style={appStyles.rowFlow}>
                    <Link href="/game/" asChild>
                        <FrameButton title="Look For Game" onPress={()=>{}}></FrameButton>
                    </Link>
                </View>
            }
            topRightCorner={<Text style={appStyles.mediumText}>width: {screenSize.width} height: {screenSize.height}</Text>}
            
            leftSideContent={
                <View style={appStyles.columnFlow}>
                    { player && <FrameButton title={player.name} onPress={()=>{}}></FrameButton> }
                    {game && 
                        game.players.map((p, index) => {
                            if(p.name === player?.name){
                                return;
                            }
                            return <FrameButton key={index} title={p.name} onPress={()=>{}}></FrameButton>;
                        })
                    }
                </View>
            }
            centralContent={
                <View style={appStyles.columnFlow}>
                    <GameId gameId={gameId} />
                    {player && editUser && <UserNameComponent user={{name:player.name}} setUserName={handleUserName}/>}
                    {player && <Text style={appStyles.mediumText}>{player.name}</Text>}
                    {gamePlayerState && <Text style={appStyles.largeText}>{gamePlayerState}</Text>}
                </View>
            }
            bottomContent={
                <View style={appStyles.columnFlow}>
                    <FrameButton title="Send" onPress={()=>sendMessage("random message")}></FrameButton>
                    {player && <Text style={[appStyles.smallText]}>player:{player.playerId}</Text>}
                    {userInfo.userId && <Text style={[appStyles.smallText]}>userId: {userInfo.userId}</Text>}
                    {token && <Text style={[appStyles.smallText]}>JSON Web Token Present</Text>}
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
    columnFlow: {
        flex: 1,
        flexDirection: 'column',
    },
});

export default Game;