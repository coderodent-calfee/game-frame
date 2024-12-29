import React, {useEffect} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";
import { useLocalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';

import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {Link} from "expo-router";
import {useAppContext} from "@/utils/AppContext";
import Logo from "@/app/components/Logo";

export default function Game() {
    const {sessionId, userInfo, setUserInfo} = useAppContext();
    const router = useRouter();
    console.log(`pathname: ${usePathname()}`);
    console.log(`segments: ${useSegments()}`);

    const { gameId } = useLocalSearchParams<{ gameId: string }>();
    console.log(`sessionId: ${sessionId}`);
    console.log(`userInfo: `, userInfo);
    console.log(`gameId: ${gameId}`);
    
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
            centralContent={<GameId gameId={gameId} />}
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