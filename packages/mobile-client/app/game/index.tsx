import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";

import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {Link, Redirect} from "expo-router";
import Logo from "@/app/components/Logo";
import {makeGetRequest} from "@/utils/requester";


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
    }, [game]);
    if(game){
        return  <Redirect href={`/game/${game.gameId}/`}/>;
    }
    return (

        <PageLayout
            cornerSize={150}
            topLeftCorner={<Logo id="top-left-corner-icon"/>}
            

            // topContent={
            //     <View style={styles.rowFlow}>
            //         <Link href={"/game/index"} asChild>
            //             <FrameButton title="Lobby" onPress={console.log("Lobby")}></FrameButton>
            //         </Link>
            //     </View>
            // }
            topRightCorner={<Text style={styles.text}>Right Corner</Text>}
            centralContent={<GameId setGameId={setGameId}/>}
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
});

