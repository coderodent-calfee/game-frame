import React, {useEffect} from 'react';

import {useRootNavigationState, Redirect, Link} from 'expo-router';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";
import rwcImage from "@/assets/images/rwc.png";
import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";

export default function Index() {
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return null;
  return (
      
      <PageLayout
        cornerSize={200}  
        topLeftCorner={<View style={styles.icon}>
          <Image source={rwcImage} style={styles.image}/>
        </View>}
        topContent={
          <View style={styles.rowFlow}>
            <Link href="/lfg" asChild>
              <FrameButton title="Lfg" onPress={console.log("Lfg")}></FrameButton>
            </Link>

            <Link href="/lobby" asChild>
              <FrameButton title="Lobby" onPress={console.log("Lobby")}></FrameButton>
            </Link>
          </View>
          
        }
        topRightCorner={<Text style={styles.text}>Right Corner</Text>}
        centralContent={<Text style={styles.text}>Central Content</Text>}
        bottomContent={<Text style={styles.text}>Bottom</Text>}
      />

  );

//  return <Redirect href={'/home'} />
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

