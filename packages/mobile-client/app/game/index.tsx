import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";

import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {Link} from "expo-router";
import Logo from "@/app/components/Logo";


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
// Looking for a Game by putting in a GameId
export default function Index() {
    const [game, setGame] = useState<GameType | undefined>();

    return (

        <PageLayout
            cornerSize={200}
            topLeftCorner={<Logo id="top-left-corner-icon"/>}
            

            // topContent={
            //     <View style={styles.rowFlow}>
            //         <Link href={"/game/index"} asChild>
            //             <FrameButton title="Lobby" onPress={console.log("Lobby")}></FrameButton>
            //         </Link>
            //     </View>
            // }
            topRightCorner={<Text style={styles.text}>Right Corner</Text>}
            centralContent={<GameId/>}
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

