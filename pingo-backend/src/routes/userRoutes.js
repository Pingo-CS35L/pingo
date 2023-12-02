import express from "express";
import { firebaseApp, database } from "../firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { master_prompts } from "../promptsList.js";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
userRouter.get("/getUserImages", async (req, res) => {
    try {
        const { id } = req.body;

        if (id === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "id is required in request body.",
                });
        }
        const docRef = doc(database, "users", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that ID",
                });
        }

        return res
            .status(200)
            .json({
                success: true,
                today_pictures: docSnap.data()["latest_prompts_pictures"],
            });
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: "Error retrieving user" });
    }
});

userRouter.get("/getPingoStats", async (req, res) => {
    try {
        const { id } = req.body;

        if (id === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "id is required in request body.",
                });
        }
        const docRef = doc(database, "users", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that ID",
                });
        }

        return res
            .status(200)
            .json({
                today_score: docSnap.data()["latest_completed_prompts"],
                total_completed_pingos: docSnap.data()["completed_pingos"],
                total_completed_prompts: docSnap.data()["completed_prompts"],
            });
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: "Error retrieving user" });
    }
});

function generatePrompts() {
    let prompt_arr = [];
    while (prompt_arr.length < 9) {
        let num = Math.floor(Math.random() * 5);
        let promptsArr = master_prompts[num];
        prompt_arr.push(
            promptsArr[Math.floor(Math.random() * promptsArr.length)]
        );
    }
    return prompt_arr;
}

userRouter.post("/getPrompts", async (req, res) => {
    try {
        const { id } = req.body;

        if (id === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "id is required in request body.",
                });
        }

        const docRef = doc(database, "users", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that ID",
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
                        message: "Generated Prompts",
                        prompts: generatedPrompts,
                    });
            } catch {
                console.error("Error generating prompts:", error);
                return res
                    .status(500)
                    .json({ message: "Error generating prompts" });
            }
        } else {
            const storedPrompts = docSnap.data()["latest_prompts"];
            return res
                .status(200)
                .json({
                    message: "Returned Latest Prompts",
                    prompts: storedPrompts,
                });
        }
    } catch (err) {
        console.error(err);
        return res.status(401).send("Error in retrieving prompts");
    }
});

// get all users from the database and send back as json
userRouter.get("/getAllUsers", async (req, res) => {
    try {
        const snapshot = await firestore.collection("users").get();
        const data = snapshot.docs.map((doc) => doc.data());
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, error: "Error retrieving users" });
    }
});

// get a single user by id
userRouter.get("/getUserById", async (req, res) => {
    try {
        const { id } = req.body;

        if (id === undefined) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "id is required in request body.",
                });
        }
        const docRef = doc(database, "users", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "No User Found with that ID",
                });
        }

        return res.status(200).json(docSnap.data());
    } catch (error) {
        console.log(error);
        return res
            .status(403)
            .json({ success: false, message: "Error retrieving user" });
    }
});

// update user info in db
// userRouter.put('/updateUserInfo', async (req, res) => {
//         const body = req.body;
//         const id = req.params.id;
//         const updates = {};
//         Object.keys(body).forEach(key => {
//             updates[`${key}`] = body[key];
//         });
//         firestore.collection('users')
//         .doc(id)
//         .update(updates)
//         .then(() => {
//         res.status(200).json({ success: true, message: 'User updated'});
//         })
//         .catch(err => {
//         res.status(500).json({ success: false, err });
//         });
//  });

// delete user from db
userRouter.delete("/deleteUser", async (req, res) => {
    const { id } = req.body;
    if (id === undefined) {
        return res
            .status(401)
            .json({
                success: false,
                message: "id is required in request body.",
            });
    }
    await deleteDoc(doc(database, "users", id))
        .then(() => {
            res.status(200).json({ success: true, message: "user deleted" });
        })
        .catch((err) => {
            res.status(500).json({ success: false, err });
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

userRouter.get("/getAllFriends", async (req, res) => {
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
        return res.status(200).json(docSnap.data()["friends"]);
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to get all friends" });
    }
});

userRouter.get("/getFriendsUsernames", async (req, res) => {
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
            console.log(friendDocSnap.data());
            friendUsernames.push(friendDocSnap.data()["username"]);
            console.log(friendUsernames);
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

userRouter.get("/recommendFriends", async (req, res) => {
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
                    recommendedFriendsIds.add(friendFriendId);
                }
            }
        }

        if (recommendedFriendsIds.length === 0) {
            for(let i = 0; i < 5; i++) {
                const usersCollection = collection(database, 'users');
                const querySnapshot = await getDocs(usersCollection);
                const totalUsers = querySnapshot.size;

                // Step 2: Generate a random number within the range of document indices
                const randomIndex = Math.floor(Math.random() * totalUsers);

                // Step 3: Retrieve the document at the randomly generated index
                const query = await getDocs(query(usersCollection, orderBy('createdAt'), limit(1), startAt(randomIndex)));
                const randomUserId = (query.docs[0]).id;

                if (randomUserId !== userId && !currentUserFriendIds.includes(randomUserId)) {
                    recommendedFriendsIds.add(randomUserId);
                }
            }
        }

        return res
            .status(200)
            .json({
                success: true,
                recommendedFriendsIds: recommendedFriendsIds,
            });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Failed to recommend friends" });
    }
});

export { userRouter };
