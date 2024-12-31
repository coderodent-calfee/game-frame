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
    const {sessionId, userInfo, getStoredJSON} = useAppContext();
    const [gamePlayer, setGamePlayer] = useState<GamePlayerMap | undefined>();
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
    useEffect(()=>{
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

        // gamePlayerMap[gameId][playerId] = playerData;

        const gameSearchParams = {gameId};
        if(sessionId) {
            gameSearchParams["sessionId"] = sessionId;
        }
        // in point of fact; we should just ask the server what our playerId is
        if(!player){
            makeGetRequest<GameInfoType>(`api/game/${gameId}/info`, new URLSearchParams(gameSearchParams))
                .then((response) => {
                    console.log("GameInfo response:", response);
                    if(response.player){
                        console.log("player:", response.player);

                        setPlayer(response.player);
                    }
                    else {
                        setPlayerNotFound();
                    };
                }).catch((error) => {
                console.log("GameInfo failed:", error)
                setPlayerNotFound();
            });
        }

    }, []);

    console.log(`Player: `, player);
    let playerName : string = "Looking";
    if(player){
        playerName = player['name'];
    }


    console.log("playerName:", playerName);

    return (
        <PageLayout
            cornerSize={200}
            topLeftCorner={<Logo id="top-left-corner-icon"/> }
            topContent={
                <View style={styles.rowFlow}>
                    <Link href="/game/" asChild>
                        <FrameButton title="Look For Game" onPress={()=>{}}></FrameButton>
                    </Link>
                </View>
            }
            topRightCorner={<Text style={styles.text}>Right Corner</Text>}
            leftSideContent={
                <View style={styles.columnFlow}>
                    <FrameButton title={playerName} onPress={()=>{}}></FrameButton>
                </View>
            }
            centralContent={
                <View style={styles.columnFlow}>
                    <GameId gameId={gameId} />
                    <Text style={styles.text}>{playerName}</Text>

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

export default Game;