import React, {useEffect} from 'react';

import { useRootNavigationState, Redirect } from 'expo-router';
import {Dimensions, Image, StyleSheet, Text, TextInput, View} from "react-native";
import rwcImage from "@/assets/images/rwc.png";
import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";

export default function Index() {
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return null;
  return (
      <View style={styles.container}>
          <View style={[styles.header, { backgroundColor: 'red' }] }>
            <View style={[styles.side], { backgroundColor: 'yellow' }} >
              <Text style={styles.text}>Left Corner</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.text}>Header</Text>
            </View>
            <View style={[styles.side], { backgroundColor: 'blue' }} >
              <Text style={styles.text}>Right Corner</Text>
            </View>
          </View>

        {/* Body Section */}
        <View style={styles.body}>
          <View style={styles.side} />
          <View style={styles.center} backgroundColor={'#666'} >
            <Text style={styles.text}>Central Content</Text>
          </View>
          <View style={styles.side} />
        </View>

        <View style={[styles.header, { backgroundColor: 'red' }] }>
          <View style={[styles.side], { backgroundColor: 'yellow' }} >
            <Text style={styles.text}>Left Corner</Text>
          </View>
          <View style={styles.center}>
            <Text style={styles.text}>Header</Text>
          </View>
          <View style={[styles.side], { backgroundColor: 'blue' }} >
            <Text style={styles.text}>Right Corner</Text>
          </View>
        </View>
      </View>
  );

  // return (
  //     <View style={styles.header}>
  //       <View className="App-header grid-container" style={styles.container}>
  //
  //         <View className="icon" style={styles.icon}>
  //
  //             <Image source={rwcImage} style={styles.image} />
  //          
  //         </View>
  //         <View className="top" style={styles.top}>
  //           <FrameButton
  //               title="Submit"
  //               onPress={() => console.log('Submit button pressed')}
  //           />
  //           <FrameButton
  //               title="Clear"
  //               onPress={() => console.log('Clear button pressed')}
  //           />
  //         </View>
  //         <View className="navigation" style={styles.navigation}>
  //         </View>
  //         <View className="content" style={styles.content}>
  //
  //          
  //           <GameId gameId="AB12CD"/>
  //           <GameId/>
  //
  //         </View>
  //       </View>
  //     </View>
  // );
//  return <Redirect href={'/home'} />
}

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: '#282c34',
//     minHeight: Dimensions.get('window').height,
//     display: 'flex',
//     flexDirection: 'column',
//     flex: 1,
//     justifyContent: 'center',
//     fontSize: 10 + 2 * Math.min(Dimensions.get('window').width, Dimensions.get('window').height) / 100,
//     color: 'white', // Text color is set in `Text`, not the container
//     width: '100%',
//   },
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   top: {
//     backgroundColor: 'lightblue',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   navigation: {
//     backgroundColor: 'lightgreen',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   content: {
//     backgroundColor: 'lightcoral',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   image: {
//     maxWidth: Dimensions.get('window').width/4,
//     width: 100,  // Specify the width of the image
//     height: 100, // Specify the height of the image
//   },
//   icon: {
//     backgroundColor: 'lightgoldenrodyellow',
//     gridArea: 'icon',
//     width: '100%',
//     boxSizing: 'border-box',
//   },
// });


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
    fontSize: 30,

  },
  header: {
    flexDirection: 'row',
    height: 60,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  side: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  text: {
    color: 'white',
    fontSize: 30,
  },
});
