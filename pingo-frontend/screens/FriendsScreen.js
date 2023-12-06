import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    Pressable,
} from "react-native";
import { Icon } from "react-native-elements";
import appLogo from "../assets/pingo-icon.png";
import { useUser } from "./../UserContext";
import {
    useFonts,
    JosefinSans_700Bold,
    JosefinSans_500Medium,
    InterTight_600SemiBold,
    InterTight_500Medium,
    InterTight_700Bold,
} from "@expo-google-fonts/dev";

function FriendPingoSquare({ prompt, pic }) {
    if (pic !== null && pic !== undefined && pic !== "") {
        return (
            <View style={styles.square}>
                <View style={styles.picContainer}>
                    <Image source={{ uri: pic }} style={styles.pic} />
                </View>
                <Text style={styles.promptText}>{prompt}</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.square}>
                <View style={styles.picContainer}>
                    <Pressable style={styles.picAddButton}>
                        <Icon
                            name="emoticon-sad-outline"
                            type="material-community"
                            color="#333330"
                            size={42}
                        />
                    </Pressable>
                    <Text style={styles.picInfoText}>No picture available</Text>
                </View>
                <Text style={styles.promptText}>{prompt}</Text>
            </View>
        );
    }
}

function FriendPingoCard({ prompts, pics }) {
    const rows = 3;
    const cols = 3;

    if (!prompts || !pics || prompts.length === 0 || pics.length === 0) {
        return <Text style={styles.loadingText}>Loading...</Text>;
    }

    const chunkArray = (arr, size) => {
        const chunkedArray = [];
        for (let i = 0; i < arr.length; i += size) {
            chunkedArray.push(arr.slice(i, i + size));
        }
        return chunkedArray;
    };

    const gridPrompts = chunkArray(prompts, cols);

    return (
        <View style={styles.bingoCard}>
            {gridPrompts.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.bingoRow}>
                    {row.map((prompt, colIndex) => (
                        <FriendPingoSquare
                            key={colIndex}
                            prompt={prompt}
                            pic={pics[rowIndex * cols + colIndex]}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
}

const FriendsScreen = ({ navigation }) => {
    const { uid, setUid } = useUser();
    const [reloadPage, setReloadPage] = useState(false);
    let [fontsLoaded, fontError] = useFonts({
        JosefinSans_700Bold,
        JosefinSans_500Medium,
        InterTight_600SemiBold,
        InterTight_500Medium,
        InterTight_700Bold,
    });

    const [friendIds, setFriendIds] = useState([]);
    const [friendUsernames, setFriendUsernames] = useState([]);
    const [friendPrompts, setFriendPrompts] = useState([]);
    const [friendPics, setFriendPics] = useState([]);
    const [recommendedFriendsIds, setRecommendedFriendsIds] = useState([]);
    const [recommendedFriendsUsernames, setRecommendedFriendsUsernames] =
        useState([]);

    useEffect(() => {
        const fetchFriendData = async () => {
            try {
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/getFriendData`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: uid,
                        }),
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setFriendIds(data.friendIds);
                    setFriendUsernames(data.friendUsernames);
                    setFriendPrompts(data.friendPrompts);
                    setFriendPics(data.friendPics);
                }
            } catch (error) {
                console.log("Error while retrieving friend data: " + error);
            }
        };

        const fetchRecommendedFriends = async () => {
            try {
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/recommendFriends`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: uid,
                        }),
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setRecommendedFriendsIds(data.recommendedFriendsIds);
                    setRecommendedFriendsUsernames(
                        data.recommendedFriendsUsernames
                    );
                }
            } catch (error) {
                console.log(
                    "Error while retrieving recommended friends: " + error
                );
            }
        };

        fetchFriendData();
        fetchRecommendedFriends();
    }, [uid, reloadPage]);

    if (!fontsLoaded || fontError) {
        console.log("Error loading fonts");
        return null;
    }

    const addFriend = async (index) => {
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/addFriend`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: uid,
                        friendId: recommendedFriendsIds[index],
                    }),
                }
            );

            const data = await response.json();

            if (!data.success) {
                console.log(
                    "Error while retrieving recommended friends: " +
                        data.message
                );
            } else {
                // RELOAD PAGE
                setReloadPage(!reloadPage);
            }
        } catch (error) {
            console.log("Error while retrieving recommended friends: " + error);
        }
    };

    const navigateToProfile = () => {
        navigation.navigate("Profile");
    };

    const navigateToHome = () => {
        navigation.navigate("Home");
    };

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image source={appLogo} style={styles.logo} />
                    </View>
                    <Text style={styles.heading}>Friends</Text>
                </View>

                <View>
                    {friendIds.length > 0 ? (
                        <View style={styles.friendPingosContainer}>
                            {friendIds.map((friendUID, index) => (
                                <View
                                    key={friendUID}
                                    style={styles.friendPingoContainer}
                                >
                                    <Text style={styles.subheading}>
                                        {friendUsernames[index]}
                                    </Text>
                                    <FriendPingoCard
                                        prompts={friendPrompts[index]}
                                        pics={friendPics[index]}
                                    />
                                </View>
                            ))}
                        </View>
                    ) : null}
                </View>

                {recommendedFriendsIds.length > 0 && (
                    <>
                        <Text style={styles.subheading}>Add Friends</Text>
                        <View style={styles.friendContainer}>
                            {recommendedFriendsIds.map((friendId, index) => (
                                <View key={friendId} style={styles.friendCard}>
                                    <Text style={styles.friendName}>
                                        {recommendedFriendsUsernames[index]}
                                    </Text>
                                    <Pressable
                                        style={styles.friendAddIcon}
                                        onPress={() => addFriend(index)}
                                    >
                                        <Icon
                                            name="account-plus"
                                            type="material-community"
                                            color="#ffffff"
                                            size={32}
                                        />
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>

            <View style={styles.navbar}>
                <View style={styles.navRow}>
                    <Pressable
                        style={styles.navButton}
                        onPress={navigateToProfile}
                    >
                        <Icon
                            name="account"
                            type="material-community"
                            color="#333330"
                            size={40}
                        />
                    </Pressable>

                    <Pressable
                        style={styles.navButton}
                        onPress={navigateToHome}
                    >
                        <Icon
                            name="home"
                            type="material-community"
                            color="#333330"
                            size={40}
                        />
                    </Pressable>

                    <Pressable style={styles.navButton}>
                        <Icon
                            name="account-supervisor"
                            type="material-community"
                            color="#1d714a"
                            size={40}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#A9E8BF",
    },
    container: {
        backgroundColor: "#A9E8BF",
        flexGrow: 1,
    },
    header: {
        backgroundColor: "#A9E8BF",
        width: "100%",
        alignItems: "flex-end",
    },
    logoContainer: {
        width: 40,
        height: 40,
        marginTop: 50,
        marginRight: 30,
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3,
    },
    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
    },
    heading: {
        fontSize: 44,
        fontWeight: "bold",
        color: "#1e2120",
        alignSelf: "flex-start",
        marginLeft: 20,
        fontFamily: "InterTight_700Bold",
        color: "#333330",
    },
    subheading: {
        fontSize: 30,
        color: "#1e2120",
        alignSelf: "flex-start",
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 10,
        fontFamily: "InterTight_700Bold",
        color: "#333330",
    },
    friendPingosContainer: {
        marginBottom: 100,
    },
    bingoCard: {
        padding: 15,
        marginBottom: 15,
        alignContent: "flex-start",
    },
    bingoRow: {
        flexDirection: "row",
    },
    square: {
        margin: 5,
        alignItems: "center",
        flex: 1,
        minHeight: 150,
        alignSelf: "flex-start",
    },
    picContainer: {
        backgroundColor: "white",
        width: "100%",
        height: 105,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    picAddButton: {
        marginTop: 10,
    },
    pic: {
        width: "100%",
        height: "100%",
        backgroundColor: "orange",
        borderRadius: 5,
    },
    picInfoText: {
        color: "#666666",
        fontSize: 11,
        fontFamily: "InterTight_400Regular_Italic",
        textAlign: "center",
        marginTop: 10,
    },
    promptText: {
        color: "#1e2120",
        fontSize: 14,
        fontFamily: "InterTight_500Medium",
        padding: 5,
        textAlign: "center",
    },
    loadingText: {
        color: "#666666",
        fontSize: 25,
        fontFamily: "InterTight_500Medium",
        textAlign: "center",
    },
    friendContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 120,
    },
    friendCard: {
        backgroundColor: "#1e2120",
        width: "90%",
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 10,
        borderRadius: 50,
        flexDirection: "row",
    },
    friendName: {
        color: "white",
        fontSize: 22,
        fontFamily: "InterTight_600SemiBold",
        flex: 1,
        justifyContent: "center",
        width: "100%",
        lineHeight: 32,
        paddingLeft: 12,
    },
    friendAddIcon: {
        flex: 1,
        width: "100%",
        alignItems: "flex-end",
        paddingRight: 12,
    },
    navbar: {
        backgroundColor: "#ffffff",
        height: 90,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    navRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    navButton: {
        flex: 1,
        marginHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default FriendsScreen;
