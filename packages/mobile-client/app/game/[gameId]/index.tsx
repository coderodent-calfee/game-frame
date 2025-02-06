import React, {useEffect, useState} from 'react';
import {Text, View} from "react-native";
import {Link, useLocalSearchParams, useRouter} from 'expo-router';

import FrameButton from "@/app/components/FrameButton";
import GameId from "@/app/components/GameId";
import PageLayout from "@/app/components/PageLayout";
import {Player, useAppContext} from "@/utils/AppContext";
import Logo from "@/app/components/Logo";
import {makePostRequest, MakeRequestError} from "@/utils/requester";
import PlayerDisplay from "@/app/components/PlayerDisplay";
import UserNameComponent from "@/app/components/UserNameComponent";
import {clientMessage, handleSessionPlayer, socketEvents} from "@/utils/socket";


export interface Player {
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

export default function Game() {
    const {
        appStyles,
        contextGetRequest,
        contextPostRequest,
        screenSize, 
        sessionId, 
        setCurrentGameId,
        token, 
        userInfo, 
    } = useAppContext();
    const [gamePlayerState, setGamePlayerState] = useState<string>("Landed");
    const [game, setGame] = useState<GameType | undefined>();
    const [player, setPlayer] = useState<Player | undefined>();
    const [editUser, setEditUser] = useState<boolean>(false);
    // const router = useRouter();
    const { gameId } = useLocalSearchParams<{ gameId: string }>();

// ***
// *** useEffect
// ***
    
    useEffect(() => {
        const handleSocketMessage = (message) => {
            console.log(`Received message: "${message}"`);
            const data = JSON.parse(message);
            console.log("Received data:", data);
            // Act on the message
            switch(data['type']){
                case 'name_player':{
                    getGameInfo().catch((error) => {
                        console.log("GameInfo failed:", error);
                    });
                    break;
                }
                case 'add_player':{
                    getGameInfo().catch((error) => {
                        console.log("GameInfo failed:", error);
                    });
                    break;
                }
            }
        };

        // Register the listener
        socketEvents.on('message', handleSocketMessage);
        return () => {
            socketEvents.off('message', handleSocketMessage);
        };
    }, []);

    useEffect(() => {
        // console.log(`useEffect [gameId]: setCurrentGameId(gameId)`, gameId);
        if (!gameId || gameId.length !== 6) {
            return;
        }
        setCurrentGameId(gameId);
    }, [gameId]);
    
    useEffect(() => {
        // console.log(`useEffect editUser:${editUser} userInfo:`, userInfo);
        if (userInfo.name) {
            setEditUser(false);
        }
    }, [userInfo]);
    
    useEffect(()=>{
        // in point of fact; we should just ask the server what our playerId is
        if(gameId && token && sessionId && gamePlayerState == "Landed" && userInfo.userId){
            console.log(`useEffect: [gameId, token, sessionId, gamePlayerState, userInfo]`);
            // first we ensure the game is legit
            setGamePlayerState("looking for game");
            getGameInfo()
                .then((_) => claimOrAddPlayer())
                .catch((error) => {
                    console.log("GameInfo failed:", error);
                    // todo: under what circumstances do I go all the way back to login
                    // router.navigate(`game/`, { key: "LookForGame" }); // key still needed?
                    setGamePlayerState("failed ");
                });
        }
    }, [gameId, token, sessionId, gamePlayerState, userInfo]);

// ***
// *** Handlers
// ***

    const handleUserName = (info)=>{
        // console.warn("handleUserName ", info);
        if(!player){
            return;
        }
        contextPostRequest<GameInfoType>({
            path: `api/game/${gameId}/name/`,
            token,
            body: {
                userId: userInfo.userId,
                name: info["name"],
                playerId: player.playerId,
            }
        })
        .then((response) => {
            console.log("change player name response:", response);
            setEditUser(false);
            if(player.playerId === response.player?.playerId){
                setPlayer(response.player);
            }

        }).catch((error) => {
            console.log("setPlayerName failed:", error)
        });
        
    };

    // const isEmpty = (obj: object): boolean => {
    //     return Object.keys(obj).length === 0;
    // };
    
    const getGameInfo = async () => {
        return contextGetRequest<GameInfoType>({
            path : `api/game/${gameId}/info/`,
            token,
            params : {
                sessionId: sessionId
            }
        })
        .then((response) => {
            console.log("getGameInfo response:", response);
            if (!response.game) {
                console.log("no game?!:");
                // why is it not error status?
                throw new MakeRequestError(`No Game with Id ${gameId}`, response);
            }
            setGame(response.game);
            return response;
        })
        .catch((error) => {
          console.log("getGameInfo failed:", error);
        });

};

    const claimOrAddPlayer = async () => {
        setGamePlayerState("claim player");
        // todo: change the param to data
        return contextPostRequest<GameInfoType>({
            path: `api/game/${gameId}/claim/`,
            token,
            body: {
                sessionId: sessionId
            }
        })
        .then((response) => {
            setGamePlayerState("player claimed");
            console.log("player claim made :", response);
            console.log("my player(s):", response.player);
            // the server will connect the player to the sessionID
            // but we must ensure the socket->session is also valid
            const playerInfo = response['player'];
            if (playerInfo) {
                handleSessionPlayer(sessionId, playerInfo["playerId"]);
                setPlayer(playerInfo);
                setGamePlayerState("claimed player ");
            }else {
                console.log("claim player: no player data");
            }
        })
        .catch((error) => {
            console.log('404 means no unclaimed players, so add a new player', error);
            console.log('error.error:', error["error"]);
            console.log('error.response.status:', error.response.status);
            // 404 means no unclaimed players, so add a new player
            if (error.response.status != 404){
                throw error;
            }
            setGamePlayerState("adding player ");
            return contextPostRequest<GameInfoType>({
                path: `api/game/${gameId}/add/`,
                token,
                body: {
                    userId: userInfo.userId
                }
            }).then((response) => {
                console.log("add player response:", response);
                const playerInfo = response['player'];
                if (playerInfo) {
                    handleSessionPlayer(sessionId, playerInfo["playerId"]);
                    setPlayer(playerInfo);
                    setGamePlayerState("added player ");
                }else {
                    console.log("add player no player:");
                }
            }).catch((error) => {
                console.log("add player failed:", error);
            });
        });
    };

    const toggleEditUser = () => {
        setEditUser((prevState) => !prevState);
    };

    const sendMessage = (message : string) => {
        console.log(`sendMessage: ${message}`);
        clientMessage({message});
    };
    
    let playerIndex = -1;
    if (game && player){
        playerIndex = game['players'].findIndex((p)=> {
            return p.playerId === player['playerId'];
        });
        console.log(`playerIndex ${playerIndex }`);
        
        console.log(`player['playerId'] ${player['playerId'] }`);
        playerIndex = -1;
        for(let i = 0; i < game['players'].length; i++){
            let p = game['players'][i];
            console.log(`p.playerId ${p.playerId } equal?: ${p.playerId === player['playerId']} at ${i}`);
            if(p.playerId === player['playerId']) {
                playerIndex = i;
                break;
            } 
        }
    }


    //original topRightCorner={<Text style={appStyles.mediumText}>width: {screenSize.width} height: {screenSize.height}</Text>}

    return (
        <PageLayout
            cornerSize={screenSize.corner}
            topLeftCorner={
            <View>
                {game && player && <PlayerDisplay 
                    player={player} 
                    onPress={toggleEditUser} 
                    size={screenSize.corner} 
                    playerNumber={1 + playerIndex}/>}
                {!player && <Logo id="top-left-corner-icon"/>}
            </View>


            }
            topContent={
                <View style={appStyles.rowFlow}>
                    <Link href="/game/" asChild>
                        <FrameButton title="Look For Game" onPress={()=>{}}></FrameButton>
                    </Link>
                </View>
            }
            topRightCorner={<Text style={appStyles.mediumText}>width: {screenSize.width} height: {screenSize.height}</Text>}
            
            leftSideContent={
                <View style={appStyles.columnFlow}>
                    { player && <FrameButton title={player.name} onPress={()=>{}}></FrameButton> }
                    {game && 
                        game.players.map((p, index) => {
                            if(p.name === player?.name){
                                return;
                            }
                            return <FrameButton disabled={p.isActive !== true} key={index} title={p.name} onPress={()=>{}}></FrameButton>;
                        })
                    }
                </View>
            }
            centralContent={
                <View style={appStyles.columnFlow}>
                    <GameId gameId={gameId} />
                    {player && editUser && <UserNameComponent user={{name:player.name}} setUserName={handleUserName}/>}
                    {player && <Text style={appStyles.mediumText}>{player.name}</Text>}
                    {gamePlayerState && <Text style={appStyles.largeText}>{gamePlayerState}</Text>}
                </View>
            }
            bottomContent={
                <View style={appStyles.columnFlow}>
                    <View style={appStyles.rowFlow}>
                        <FrameButton title="Send" onPress={()=>sendMessage("random message")}></FrameButton>
                        <FrameButton title="Game Info" onPress={()=>getGameInfo().catch((error) => console.log("GameInfo failed:", error))}></FrameButton>
                    </View>
                    
                    {player && <Text style={[appStyles.smallText]}>player:{player.playerId}</Text>}
                    {userInfo.userId && <Text style={[appStyles.smallText]}>userId: {userInfo.userId}</Text>}
                    {sessionId && <Text style={[appStyles.smallText]}>sessionId: {sessionId}</Text>}
                    {token && <Text style={[appStyles.smallText]}>JSON Web Token Present</Text>}
                </View>}
        />

    );
}
//
// const styles = StyleSheet.create({
//     text: {
//         color: 'white',
//         fontSize: 30,
//     },
//     image: {
//         flex: 1,
//     },
//     icon: {
//         flex: 1,
//     },
//     rowFlow: {
//         flex: 1,
//         flexDirection: 'row',
//     },
//     columnFlow: {
//         flex: 1,
//         flexDirection: 'column',
//     },
// });

