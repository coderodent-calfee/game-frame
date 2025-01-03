﻿import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";
import { useLocalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';

import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {Link} from "expo-router";
import {Player, useAppContext} from "@/utils/AppContext";
import Logo from "@/app/components/Logo";
import {makeGetRequest, makePostRequest} from "@/utils/requester";
import {startSocket} from "@/utils/socket";

interface PlayerInfo {
    [playerId: string]: any;
}

interface GamePlayerMap {
    [gameId: string]: PlayerInfo;
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
    player?: Player;
}

export default function Game() {
    const {screenSize, appStyles, sessionId, userInfo, getStoredJSON} = useAppContext();
    

    const [gamePlayer, setGamePlayer] = useState<GamePlayerMap | undefined>();
    const [game, setGame] = useState<GameType | undefined>();
    const [player, setPlayer] = useState<Player | undefined>();
    const router = useRouter();
    const { gameId } = useLocalSearchParams<{ gameId: string }>();
    console.log(`in gameId: ${gameId}`);
    console.log(`gamePlayer: `, gamePlayer);

    const setPlayerNotFound = (): void => {
        setPlayer({gameId: "Not Found", name: "Not Found", playerId: "Not Found"});
    };

    const isEmpty = (obj: object): boolean => {
        return Object.keys(obj).length === 0;
    };
    useEffect(()=> {
        // getting here we should have saved the playerID in the localstore (but could put in a query)
        if( gamePlayer === undefined){
            // we came to the game, but we still must be sure we belong here
            getStoredJSON('gamePlayer').then((storedGamePlayerInfo)=>{
                if(storedGamePlayerInfo){
                    if(isEmpty(storedGamePlayerInfo)){return;}
                    setGamePlayer(storedGamePlayerInfo);
                }
            });
            // still loading 
        }
    }, []);
    
    useEffect(()=>{
        const gameSearchParams = {gameId};
        if(sessionId) {
            gameSearchParams["sessionId"] = sessionId;
        }
        if((gamePlayer && gamePlayer[gameId])) {
            console.log("RWC gamePlayer[gameId]:", gamePlayer[gameId]);
        }
        // in point of fact; we should just ask the server what our playerId is
    
        makeGetRequest<GameInfoType>(`api/game/${gameId}/info`, new URLSearchParams(gameSearchParams))
            .then((response) => {
                if(!response.game){
                    // why is it not error status?
                    // todo: navigate away from here: no game exists
                }
                setGame(response.game);
                console.log("RWC GameInfo response:", response);
                if(response.player){
                    console.log("RWC player:", player);
                    if(player?.playerId !== response.player.playerId){
                        setPlayer(response.player);
                    }
                }
                else {
                    //todo: this may no longer be needed
                    console.log("no player:", game);

                    if((gamePlayer && gamePlayer[gameId])) {
                        console.log("RWC no player and gamePlayer[gameId]:", gamePlayer[gameId]);
                        const gamePlayers = Object.keys(gamePlayer[gameId]);
                        response.game.players.forEach((p)=>{
                            if( gamePlayers.includes( p.playerId )){
                                if(player?.playerId !== p.playerId) {

                                    setPlayer(p);
                                }
                            }
                        });
                    }
                }
            }).catch((error) => {
                console.log("GameInfo failed:", error);
                setPlayerNotFound();
            }
        );
    }, [player, gamePlayer]);

    console.log(`Player: `, player);
    let playerName : string = "Looking";
    if(player){
        playerName = player['name'];
    }


    console.log("playerName:", playerName);

    return (
        <PageLayout
            cornerSize={screenSize.corner}
            topLeftCorner={<Logo id="top-left-corner-icon"/> }
            topContent={
                <View style={appStyles.rowFlow}>
                    <Link href="/game/" asChild>
                        <FrameButton title="Look For Game" onPress={()=>{}}></FrameButton>
                    </Link>
                </View>
            }
            topRightCorner={<Text style={appStyles.largeText}>Right Corner</Text>}

            leftSideContent={
                <View style={appStyles.columnFlow}>
                    <FrameButton title={playerName} onPress={()=>{}}></FrameButton>
                    {game && game.players.map((item, index) => (
                        <FrameButton title={item.name} onPress={()=>{}}></FrameButton>
                    ))}
                </View>
            }
            centralContent={
                <View style={appStyles.columnFlow}>
                    <GameId gameId={gameId} />
                    <Text style={appStyles.mediumText}>{playerName}</Text>

                </View>
            }
            bottomContent={
                <View style={appStyles.columnFlow}>
                    <Text style={[appStyles.largeText]}>width: {screenSize.width} height: {screenSize.height}</Text>

                    <Text style={[appStyles.smallText]}>session:{sessionId}</Text>
                    {player && <Text style={[appStyles.smallText]}>player:{player.playerId}</Text>}
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