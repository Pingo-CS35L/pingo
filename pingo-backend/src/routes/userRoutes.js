import express from "express";
import { firebaseApp, database, storage } from "../firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { master_prompts } from "../promptsList.js";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const userRouter = express.Router();
const auth = getAuth(firebaseApp);

// Middleware to get the current user's UID
const getCurrentUserUID = (req, res, next) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            req.currentUserUID = user.uid;
        }
        next();
    });
};

// Allows for user's UID to be available for each route by simply calling req.currentUserUID
userRouter.use(getCurrentUserUID);

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (email === undefined || password === undefined) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Missing email and/or password in request body.",
            });
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Logged in
            const user = userCredential.user;
            return res
                .status(200)
                .json({
                    success: true,
                    message: "Logged in successfully!",
                    uid: user.uid,
                });
        })
        .catch((error) => {
            return res
                .status(401)
                .json({ success: false, message: error.message });
        });
});

userRouter.post("/signup", async (req, res) => {
    const { email, username, password } = req.body;

    if (
        email === undefined ||
        username === undefined ||
        password === undefined
    ) {
        return res
            .status(401)
            .json({
                success: false,
                message:
                    "Missing email, username, and/or password in request body.",
            });
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        // Signed up
        const user = userCredential.user;

        const newUserData = {
            username: username,
            email: email,
            completed_pingos: 0,
            completed_prompts: 0,
            friends: [],
            last_completed_pingo: "",
            latest_completed_prompts: 0,
            latest_prompts: Array(9).fill(""),
            latest_prompts_pictures: Array(9).fill(""),
        };

        // GENERATE PROMPTS FOR NEW USER

        setDoc(doc(database, "users", user.uid), newUserData);

        return res
            .status(200)
            .json({
                success: true,
                message: "Signed up successfully!",
                uid: user.uid,
            });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: error.message });
    }
});

// NOTE: Database will hold url to images, so calling get() on the database will return a url which will need to be processed farther. (Probably better to do on frontend?)
userRouter.post("/getUserImages", async (req, res) => {
    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that userId",
                });
        }

        const data = docSnap.data();

        const lastTimestamp = data["last_completed_pingo"];
        const dateNow = new Date().toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });
        const timeStamp = new Date(lastTimestamp).toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });
        
        let pics = [];

        if (timeStamp && dateNow !== timeStamp) {

            const generatedPrompts = generatePrompts();
            pics = Array(9).fill("");

            await updateDoc(docRef, {
                latest_prompts: generatedPrompts,
                last_completed_pingo: dateNow,
                latest_completed_prompts: 0,
                latest_prompts_pictures: pics,
            });
            
        } else {
            pics = data["latest_prompts_pictures"];
        }

        return res
            .status(200)
            .json({
                success: true,
                today_pictures: pics,
            });

    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: "Error retrieving user images." });
    }
});

userRouter.post("/getPingoStats", async (req, res) => {
    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that userId",
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                today_score: docSnap.data()["latest_completed_prompts"],
                total_completed_pingos: docSnap.data()["completed_pingos"],
                total_completed_prompts: docSnap.data()["completed_prompts"],
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Error retrieving user" });
    }
});

function generatePrompts() {
    let promptsCopy = [...master_prompts];
    let prompt_arr = [];

    while (prompt_arr.length < 9 && promptsCopy.length > 0) {
        const randomIndex = Math.floor(Math.random() * promptsCopy.length);
        const selectedPrompt = promptsCopy.splice(randomIndex, 1)[0];
        prompt_arr.push(selectedPrompt);
    }

    return prompt_arr;
}

userRouter.post("/getPrompts", async (req, res) => {
    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }

        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that userId",
                });
        }
        const data = docSnap.data();

        const lastTimestamp = data["last_completed_pingo"];
        const dateNow = new Date().toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });
        const timeStamp = new Date(lastTimestamp).toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
        });

        if (timeStamp && dateNow !== timeStamp) {
            try {
                const generatedPrompts = generatePrompts();
                await updateDoc(docRef, {
                    latest_prompts: generatedPrompts,
                    last_completed_pingo: dateNow,
                    latest_completed_prompts: 0,
                    latest_prompts_pictures: Array(9).fill(""),
                });
                return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Generated Prompts",
                        prompts: generatedPrompts,
                    });
            } catch {
                console.error("Error generating prompts:", error);
                return res
                    .status(500)
                    .json({ success: false, message: "Error generating prompts" });
            }
        } else {
            const storedPrompts = data["latest_prompts"];
            return res
                .status(200)
                .json({
                    success: true,
                    message: "Returned Latest Prompts",
                    prompts: storedPrompts,
                });
        }
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ success: false, message: "Error retrieving prompts" });
    }
});

// get all users from the database and send back as json
userRouter.get("/getAllUsers", async (req, res) => {
    try {
        const snapshot = await firestore.collection("users").get();
        const data = snapshot.docs.map((doc) => doc.data());
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, error: "Error retrieving users" });
    }
});

// get a single user by id
userRouter.post("/getUserById", async (req, res) => {
    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that userId",
                });
        }

        return res.status(200).json({ success: true, user: docSnap.data() });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "Error retrieving user" });
    }
});

// delete user from db
userRouter.delete("/deleteUser", async (req, res) => {
    const { userId } = req.body;
    if (userId === undefined) {
        return res
            .status(401)
            .json({
                success: false,
                message: "userId is required in request body.",
            });
    }
    await deleteDoc(doc(database, "users", userId))
        .then(() => {
            res.status(200).json({ success: true, message: "user deleted" });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: err });
        });
});

userRouter.post("/addFriend", async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        if (userId === undefined || friendId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId and friendId is required in request body.",
                });
        }
        const docRef1 = doc(database, "users", userId);
        const docRef2 = doc(database, "users", friendId);
        const docSnap1 = await getDoc(docRef1);
        const docSnap2 = await getDoc(docRef2);

        if (!docSnap1.exists() || !docSnap2.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User and/or Friend Found with that ID",
                });
        }
        if (
            docSnap1.data()["friends"].includes(friendId) ||
            docSnap2.data()["friends"].includes(userId)
        ) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "At least one of you are already friends",
                });
        }

        await updateDoc(docRef1, {
            friends: [...docSnap1.data()["friends"], friendId],
        });

        await updateDoc(docRef2, {
            friends: [...docSnap2.data()["friends"], userId],
        });
        return res
            .status(200)
            .json({ success: true, message: "Successfully added friend" });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to become friends" });
    }
});

userRouter.delete("/deleteFriend", async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        if (userId === undefined || friendId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId and friendId is required in request body.",
                });
        }
        const docRef1 = doc(database, "users", userId);
        const docRef2 = doc(database, "users", friendId);
        const docSnap1 = await getDoc(docRef1);
        const docSnap2 = await getDoc(docRef2);

        if (!docSnap1.exists() || !docSnap2.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User and/or Friend Found with that ID",
                });
        }
        if (
            !docSnap1.data()["friends"].includes(friendId) ||
            !docSnap2.data()["friends"].includes(userId)
        ) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "At least one of you are not friends",
                });
        }
        await updateDoc(docRef1, {
            friends: docSnap1
                .data()
                ["friends"].filter((item) => item !== friendId),
        });
        await updateDoc(docRef2, {
            friends: docSnap2
                .data()
                ["friends"].filter((item) => item !== userId),
        });
        return res
            .status(200)
            .json({ success: true, message: "Successfully deleted friend" });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to remove friend" });
    }
});

userRouter.post("/getAllFriends", async (req, res) => {
    try {
        const { userId } = req.body;
        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({ success: false, message: "No such user found." });
        }
        return res.status(200).json({ success: true, friendIds: docSnap.data()["friends"] });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to get all friends" });
    }
});

userRouter.post("/getFriendsUsernames", async (req, res) => {
    try {
        const { userId } = req.body;
        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "UserId is required in request body.",
                });
        }
        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({ success: false, message: "No such user found." });
        }
        const friendIds = docSnap.data()["friends"];
        let friendUsernames = [];
        for (let i = 0; i < friendIds.length; i++) {
            const id = friendIds[i];
            const friendDocRef = doc(database, "users", id);
            const friendDocSnap = await getDoc(friendDocRef);
            if (!friendDocSnap.exists()) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Friend found that is not a valid user.",
                    });
            }

            friendUsernames.push(friendDocSnap.data()["username"]);
        }
        return res
            .status(200)
            .json({ success: true, friendUsernames: friendUsernames });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to get friends' usernames",
            });
    }
});

userRouter.post("/getFriendData", async (req, res) => {
    try {
        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "UserId is required in request body.",
                });
        }

        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({ success: false, message: "No such user found." });
        }

        const friendIds = docSnap.data()["friends"];
        let friendUsernames = [];
        let friendPrompts = [];
        let friendPics = [];

        for (let i = 0; i < friendIds.length; i++) {
            const friendId = friendIds[i];

            const friendDocRef = doc(database, "users", friendId);
            const friendDocSnap = await getDoc(friendDocRef);

            if (!friendDocSnap.exists()) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Friend found that is not a valid user.",
                    });
            }

            friendUsernames.push(friendDocSnap.data()["username"]);

            const lastTimestamp = friendDocSnap.data()["last_completed_pingo"];
            const dateNow = new Date().toLocaleDateString("en-US", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            });
            const timeStamp = new Date(lastTimestamp).toLocaleDateString("en-US", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            });

            let prompts = [];
            let pics = [];

            if (timeStamp && dateNow !== timeStamp) {

                prompts = generatePrompts();
                pics = Array(9).fill("");

                await updateDoc(friendDocRef, {
                    latest_prompts: prompts,
                    last_completed_pingo: dateNow,
                    latest_completed_prompts: 0,
                    latest_prompts_pictures: pics,
                });

            } else {
                prompts = friendDocSnap.data()["latest_prompts"];
                pics = friendDocSnap.data()["latest_prompts_pictures"];
            }

            friendPrompts.push(prompts);
            friendPics.push(pics);
        }

        return res
            .status(200)
            .json({ success: true, friendIds: friendIds, friendUsernames: friendUsernames, friendPrompts: friendPrompts, friendPics, friendPics });

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({
                success: false,
                message: "Failed to get friend data",
            });
    }
});

userRouter.post("/recommendFriends", async (req, res) => {
    try {

        const { userId } = req.body;

        if (userId === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "userId is required in request body.",
                });
        }

        const docRef = doc(database, "users", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No user found with that ID",
                });
        }

        const recommendedFriendsIds = [];
        const recommendedFriendsUsernames = [];

        const currentUserFriendIds = docSnap.data()["friends"];
        for (let i = 0; i < currentUserFriendIds.length; i++) {
            let friendId = currentUserFriendsIds[i];
            const friendDocRef = doc(database, "users", friendId);
            const friendDocSnap = await getDoc(friendDocRef);

            if (!friendDocSnap.exists()) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Friend found that does not exist as a user.",
                    });
            }

            const friendsFriendIds = friendDocSnap.data()["friends"];
            for (let j = 0; j < friendsFriendIds.length; j++) {
                const friendFriendId = friendsFriendIds[j];

                if (friendFriendId !== userId && !currentUserFriendIds.includes(friendFriendId)) {

                    const friendFriendDocRef = doc(database, "users", friendFriendId);
                    const friendFriendDocSnap = await getDoc(friendDocRef);


                    if (!friendFriendDocSnap.exists()) {
                        return res
                            .status(500)
                            .json({
                                success: false,
                                message: "Friend friend found that does not exist as a user.",
                            });
                    }

                    recommendedFriendsIds.push(friendFriendId);
                    recommendedFriendsUsernames.push(friendFriendDocSnap.data()["username"]);
                }
            }
        }

        if (recommendedFriendsIds.length === 0) {

            for(let i = 0; i < 5; i++) {
                const usersCollection = collection(database, 'users');
                const querySnapshot = await getDocs(usersCollection);
                
                const totalUsers = querySnapshot.size;

                const randomIndex = Math.floor(Math.random() * totalUsers);
                let randIds = [];

                querySnapshot.forEach((doc) => {
                    const randId = doc.id;
                    randIds.push(randId);
                });

                const randomUserId = randIds[randomIndex];

                if (randomUserId !== userId && !currentUserFriendIds.includes(randomUserId)) {
                    const foundFriendDocRef = doc(database, "users", randomUserId);
                    const foundFriendDocSnap = await getDoc(foundFriendDocRef);

                    if (!foundFriendDocSnap.exists()) {
                        return res
                            .status(500)
                            .json({
                                success: false,
                                message: "Random friend found that does not exist as a user.",
                            });
                    }
                    
                    if (!recommendedFriendsIds.includes(randomUserId)) {
                        recommendedFriendsIds.push(randomUserId);
                        recommendedFriendsUsernames.push(foundFriendDocSnap.data()["username"]);
                    }
                }
            }
        }

        return res
            .status(200)
            .json({
                success: true,
                recommendedFriendsIds: recommendedFriendsIds,
                recommendedFriendsUsernames: recommendedFriendsUsernames
            });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to recommend friends. " + error });
    }
});

// Route to upload images to Firebase Storage                                                                                           
// Requires images to be of type 'file'                                                                                                 
userRouter.post('/uploadImage', async (req, res) => {
  try {
    const { file } = req.files;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const storageRef = ref(storage, 'images/' + file.name);

    const snapshot = await uploadBytes(storageRef, file.data);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return res.status(200).json({ success: true, url: downloadURL });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});



export { userRouter };
