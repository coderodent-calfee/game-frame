import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";
import { useLocalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';

import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {Link} from "expo-router";
import {useAppContext} from "@/utils/AppContext";
import Logo from "@/app/components/Logo";

interface PlayerInfo {
    [playerId: string]: any;
}

interface GamePlayerMap {
    [gameId: string]: PlayerInfo;
}

export default function Game() {
    const {sessionId, userInfo, getStoredJSON} = useAppContext();
    const [gamePlayer, setGamePlayer] = useState<GamePlayerMap | undefined>();

    const router = useRouter();
    console.log(`pathname: ${usePathname()}`);
    console.log(`segments: ${useSegments()}`);

    const { gameId } = useLocalSearchParams<{ gameId: string }>();
    console.log(`sessionId: ${sessionId}`);
    console.log(`userInfo: `, userInfo);
    console.log(`in gameId: ${gameId}`);
    console.log(`gamePlayer: `, gamePlayer);

    const isEmpty = (obj: object): boolean => {
        return Object.keys(obj).length === 0;
    };

    // we came to the game, but we still must be sure we belong here
    getStoredJSON('gamePlayer').then((storedGamePlayerInfo)=>{
        if(storedGamePlayerInfo){
            if(isEmpty(storedGamePlayerInfo)){return;}
            setGamePlayer(storedGamePlayerInfo);
        }
    });
 
    // getting here we should have saved the playerID in the localstore (but could put in a query)
    if( gamePlayer === undefined){
        // still loading 
    }
    
    // in point of fact; we should just ask the server what our playerId is
    
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
                    <FrameButton title={userInfo.name} onPress={()=>{}}></FrameButton>
                </View>
            }
            centralContent={
                <View style={styles.columnFlow}>
                    <GameId gameId={gameId} />
                    <Text style={styles.text}>Every User Must Have A Name</Text>
                    
                </View>
            }
            bottomContent={<Text style={styles.text}>Bottom</Text>}
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
    colFlow: {
        flex: 1,
        flexDirection: 'column',
    },
});

export default Game;