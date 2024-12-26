import React, {useEffect, useState} from 'react';

import {useRootNavigationState, Redirect, Link} from 'expo-router';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";
import rwcImage from "@/assets/images/rwc.png";
import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {useAppContext} from "@/utils/AppContext";
import PlayerNameComponent from "@/app/components/PlayerNameComponent";

export default function Index() {
  const { sessionId, playerInfo, setPlayerInfo } = useAppContext();
    const [editPlayer, setEditPlayer] = useState<boolean>(true);
    
    const toggleEditPlayer = () => {
        setEditPlayer((prevState) => !prevState);
    };

    useEffect(() => {
        console.log(`useEffect editPlayer:${editPlayer} playerInfo.name:${playerInfo.name}`)
        if (playerInfo.name) {
            setEditPlayer(false);
        }
    }, [playerInfo]);
    
    return (
      <PageLayout
        cornerSize={120}  
        topLeftCorner={<View style={styles.icon}>
          <Image source={rwcImage} style={styles.image}/>
        </View>}
        topContent={
            playerInfo.name && <View style={styles.rowFlow}>
            <Link href="/lfg" asChild>
              <FrameButton title="Look For Game" onPress={console.log("Lfg")}></FrameButton>
            </Link>

            <Link href="/lobby" asChild>
              <FrameButton title="Lobby" onPress={console.log("Lobby")}></FrameButton>
            </Link>
          </View>
          
        }
        topRightCorner={<Text style={styles.text}>Right Corner</Text>}
        leftSideContent={
            playerInfo.name && 
            <View style={styles.columnFlow}>
                <Text style={styles.text}>Player:</Text>
                <FrameButton title={playerInfo.name} onPress={toggleEditPlayer}></FrameButton>
          </View>
        }
        centralContent={
          <View style={styles.columnFlow}>
              {editPlayer && <PlayerNameComponent player={playerInfo} setPlayerInfo={setPlayerInfo} />}
              {!playerInfo.name &&
                  <Text style={styles.text}>Every Player Must Have A Name</Text>}
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

