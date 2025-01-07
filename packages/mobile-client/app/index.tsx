import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from "react-native";

import FrameButton from "@/app/components/FrameButton";
import PageLayout from "@/app/components/PageLayout";
import {Player, useAppContext} from "@/utils/AppContext";
import UserNameComponent from "@/app/components/UserNameComponent";
import {socket, startSocket, handleSessionUser} from '@/utils/socket';
import {makePostRequest} from '@/utils/requester'
import {useNavigation} from "@react-navigation/native";

import {Link, useRouter} from "expo-router";
import Logo from "@/app/components/Logo";

interface GameType {
    gameId: string;
}

interface UserType {
    playerId: string;
}

interface UserStateType {
    loggedIn: boolean;
    signedUp: boolean;
}


export default function Index() {
    const { appStyles, sessionId, userInfo, setUserInfo, getStoredJSON, setStoredJSON, addPlayerToGame, screenSize } = useAppContext();
    const [editUser, setEditUser] = useState<boolean>(true);
    const [userState, setUserState] = useState<UserStateType>({ loggedIn: false, signedUp: false });
    const [displayState, setDisplayState] = useState<UserStateType>({ loggedIn: false, signedUp: false });

    //const navigation = useNavigation();
    const router = useRouter();

    const toggleEditUser = () => {
        setEditUser((prevState) => !prevState);
    };


    useEffect(() => {
        console.log(`useEffect editUser:${editUser} userInfo:`, userInfo);
        if (userInfo.name) {
            setEditUser(false);
        }
    }, [userInfo]);



    const resetUser = () => {
        console.log(`reset User:`);
        //setUserInfo({});
        //setEditUser(true);
        setUserState((prevState) => { return { ...prevState, signedUp: false }; });
    };

    const generateId = (): string => {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    const handleUserName = (info) => {
        console.log("handleUserName ", info);
    };
    
    const handlePassword = (info) => {
        console.log("handlePassword ", info);
    };

    const handleEmail= (info) => {
        console.log("handlePassword ", info);
    };

    const handleLogin = (info) => {
        console.log("handleLogin ", info);
        setUserState((prevState) => { return { ...prevState, loggedIn: true }; });
    };

    const handleLogout = (info) => {
        console.log("handleLogin ", info);
        setUserState((prevState) => { return { ...prevState, loggedIn: false }; });
    };

    const handleSignUp = (info) => {
        console.log("handleSignUp ", info);
        setUserState((prevState) => { return { ...prevState, signedUp: true }; });
    };

    const newGame = () => {
        console.log(`newGame`);
        if (!sessionId) {
            console.warn(`newGame: no sessionId`);
            return;
        }
        makePostRequest<GameType>('api/game/newGame')
            .then((response) => {
                console.log("newGame created:", response);
                const gameId = response['game'].gameId;
                return makePostRequest<UserType>(`api/game/${gameId}/join`);
            })
            .then((response) => {
                console.log("joinGame response:", response);
                const gameId = response['game'].gameId;
                const playerInfo = response['player'];
                addGamePlayer(gameId, playerInfo).then(() => {
                    router.navigate(`game/${gameId}/`, { key: "JoinGame" }); // key still needed?
                });
            }).catch((error) => {
                console.log("newGame failed:", error)
            });
    }

    // flow: username and pw are inputs, when you press sign up or log in we use that username and pw in the appropriate handler
    const showLoginInput = !(displayState.loggedIn || userState.loggedIn);
    const showSignUpInput = !(displayState.signedUp || displayState.loggedIn || userState.signedUp || userState.loggedIn);

    return (
        <PageLayout
            cornerSize={screenSize.corner}
            topLeftCorner={<Logo id="top-left-corner-icon" />}
            topContent={
                userInfo.name && userInfo.name.length &&
                <View style={appStyles.rowFlow}>
                    <Link href="/game" asChild>
                        <FrameButton title="Look For Game" onPress={() => {
                        }}></FrameButton>
                    </Link>

                    <FrameButton title="New Game" onPress={newGame}></FrameButton>


                </View>

            }
            topRightCorner={<Text style={appStyles.mediumText}>width: {screenSize.width} height: {screenSize.height}</Text>}


            leftSideContent={
                <View style={appStyles.columnFlow}>

                    {!userState.loggedIn && !userState.signedUp && < FrameButton title="Sign Up"
                        onPress={() => {
                            setDisplayState({ loggedIn: false, signedUp: false });
                        }}></FrameButton>}
                    {!userState.loggedIn && !userState.signedUp && <FrameButton title="Log In"
                        onPress={() => {
                            setDisplayState({ loggedIn: false, signedUp: true });
                        }}></FrameButton>}
                    {userState.loggedIn && <FrameButton title="Log Out" onPress={handleLogout}></FrameButton>}
                </View>
            }
            centralContent={
                <View style={[appStyles.columnFlow, { marginTop:10 }]}>

                    {showLoginInput && <UserNameComponent user={userInfo} setUserName={handleUserName} />}
                    {showLoginInput && <UserNameComponent secure={true} placeholder={'Enter Password'} user={{ name: userInfo.password }} setUserName={handlePassword} />}
                    {showSignUpInput && <UserNameComponent placeholder={'Enter Email'} user={{ name: userInfo.email }} setUserName={handleEmail} />}

                </View>
            }
            bottomContent={
                <View style={appStyles.columnFlow}>
                    <View style={[appStyles.rowFlow, { flex: "initial", justifyContent: "space-between" }]}>
                        {showSignUpInput && <FrameButton title="Sign Up" onPress={handleSignUp}></FrameButton>}
                        {showLoginInput && userState.signedUp && <FrameButton title="Log In" onPress={handleLogin}></FrameButton>}
                        {showLoginInput && <FrameButton title="Clear" onPress={() => { console.log("clear") }}></FrameButton>}
                    </View>
                    {!userState.loggedIn && <FrameButton title="Reset User" onPress={resetUser}></FrameButton>}
                </View>
            }
        />
    );
}


