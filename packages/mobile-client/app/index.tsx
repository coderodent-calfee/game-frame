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

interface JwtUserId {
    access: string;
    refresh: string;
    userId?: string;
}


export default function Index() {
    const {signIn, signOut, token, appStyles, sessionId, userInfo, setUserInfo, getStoredJSON, setStoredJSON, addPlayerToGame, screenSize } = useAppContext();

    const router = useRouter();

    const resetUser = () => {
        console.log(`reset User:`);
        setUserInfo({});
    };

    const generateId = (): string => {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    const handleUserName = (info) => {
        if (!info || !info.name || !info.name.length) {
            return;
        }
        setUserInfo((prevState) => { return { ...prevState, username: info.name }; });
    };
    
    const handlePassword = (info) => {
        if (!info || !info.name || !info.name.length) {
            return;
        }
        setUserInfo((prevState) => { return { ...prevState, password: info.name }; });
    };

    const handleEmail= (info) => {
        if (!info || !info.name || !info.name.length) {
            return;
        }
        setUserInfo((prevState) => { return { ...prevState, email: info.name }; });
    };

    const handleLogin = (info) => {
        console.log("handleLogin ", info);

        const { username, password } = userInfo;
        if (!(username && password)) {
            return;
        }

        makePostRequest<JwtUserId>({
                path : 'api/accounts/token/', 
                body : {
                    username, 
                    password
                }
            })
            .then((response) => {
                console.log("api/accounts/token/:", response);
                signIn(response);

                // TODO: next get the user info to store in local and the react state

            }).catch((error) => {
            console.log("api/accounts/token/ failed:", error)
        });

    };

    const handleLogout = (info) => {
        console.log("handleLoout ", info);
        signOut();
        
    };

    const handleSignUp = (event) => {
        console.log("handleSignUp ", userInfo);

        const { username, email, password } = userInfo;
        if (!(username && email && password)) {
            return;
        }

        makePostRequest<JwtUserId>({
                path : 'api/accounts/register/',
                body : {
                    email, 
                    username, 
                    password
                }
            })
            .then((response) => {
                console.log('api/accounts/register/: ', response);
                const success = signIn(response);
                
                // TODO: next get the user info to store in local and the react state
                
                
            }).catch((error) => {
                console.log("api/accounts/register/ failed:", error)
            });

    };

    const newGame = () => {
        console.log(`newGame`);
        if (!token) {
            console.warn(`newGame: no JWT token`);
            return;
        }
        makePostRequest<GameType>({
                path: 'api/game/new/', 
                token,
                params : {
                    userId : userInfo.userId
                }
            })
            .then((response) => {
                console.log("newGame created:", response);
                const gameId = response['game'].gameId;
                router.navigate(`game/${gameId}/`, { key: "NewGame" }); // key still needed?
            }).catch((error) => {
                console.log("newGame failed:", error)
            });
    }


    return (
        <PageLayout
            cornerSize={screenSize.corner}
            topLeftCorner={<Logo id="top-left-corner-icon" />}
            topContent={
                token &&
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
                    {token && <FrameButton title="Log Out" onPress={handleLogout}></FrameButton>}
                </View>
            }
            centralContent={
                <View style={[appStyles.columnFlow]}>

                    {!token && <UserNameComponent user={{ name: userInfo.username }} setUserName={handleUserName} />}
                    {!token && !userInfo.username && <Text style={[appStyles.smallText]}>User Name is Required</Text>}
                    {!token && <UserNameComponent secure={true} placeholder={'Enter Password'} user={{ name: userInfo.password }} setUserName={handlePassword} />}
                    {!token && !userInfo.password && <Text style={[appStyles.smallText]}>Password is Required</Text>}
                    {!token && <UserNameComponent placeholder={'Enter Email'} user={{ name: userInfo.email }} setUserName={handleEmail} />}
                    {!token && !userInfo.email && <Text style={[appStyles.smallText]}>Email is Required to Sign Up</Text>}

                </View>
            }
            bottomContent={
                <View style={appStyles.columnFlow}>
                    <View style={[appStyles.rowFlow, { flex: "initial", justifyContent: "space-between" }]}>
                        {!token && userInfo.email && <FrameButton title="Sign Up" onPress={handleSignUp}></FrameButton>}
                        {!token && <FrameButton title="Log In" onPress={handleLogin}></FrameButton>}
                        {!token && <FrameButton title="Clear" onPress={() => { console.log("clear") }}></FrameButton>}
                    </View>
                    {!token && <FrameButton title="Reset User" onPress={resetUser}></FrameButton>}
                    {userInfo.userId && <Text style={[appStyles.smallText]}>userId: {userInfo.userId}</Text>}
                    {token && <Text style={[appStyles.smallText]}>JSON Web Token Present</Text>}
                </View>
            }
        />
    );
}


