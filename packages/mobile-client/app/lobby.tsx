import React, {useEffect} from 'react';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";

import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {Link} from "expo-router";

export default function Lobby() {
    // gameId must be presented
    return (

        <PageLayout
            cornerSize={200}
            topLeftCorner={<View style={styles.icon}>
                <Text style={styles.text}>player icon</Text>
            </View>}
            topContent={
                <View style={styles.rowFlow}>
                    <Link href="/lfg" asChild>
                        <FrameButton title="Enter GameId" onPress={()=>{}}></FrameButton>
                    </Link>
                </View>
            }
            topRightCorner={<Text style={styles.text}>Right Corner</Text>}
            centralContent={<GameId gameId="AB12CD"/>}
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

