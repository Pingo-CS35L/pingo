import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from expo/vector-icons
import { useNavigation, useRoute  } from "@react-navigation/native";
import { useUser } from './../UserContext';

const CameraScreen = () => {
  const navigation = useNavigation(); // Initialize the useNavigation hook
  const route = useRoute();
  
  const { uid, setUid } = useUser();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [promptNum, setPromptNum] = useState(route.params.promptNumber);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const flipCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      setIsTakingPhoto(true);
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo);
      setIsTakingPhoto(false);
    }
  };

  const exitCamera = () => {
    navigation.goBack();
  };

  
const acceptPhoto = async () => {
  console.log(1);
    try {
        console.log(2);
        const response = await fetch(capturedPhoto.uri);
        console.log(3);
        const blob = await response.blob();
        console.log(4);

        const reader = new FileReader();
        console.log(5);
        reader.onload = () => {
            const base64String = reader.result.split(",")[1];
            console.log(6);
            const formData = new FormData();
            formData.append("image", base64String); 
            formData.append("userId", uid);
            formData.append("promptNum", promptNum);
            console.log(7);

            fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_SERVER}/user/uploadImage`,
                {
                    method: "POST",
                    body: formData,
                }
            )
                .then((response) => {
                  console.log(8);
                    if (response.ok) {
                        console.log("Photo uploaded successfully");
                    } else {
                        console.error("Failed to upload photo: " + response);
                    }
                })
                .catch((error) => {
                    console.error("Error uploading photo:", error.message);
                });
        };

        reader.readAsDataURL(blob);
    } catch (error) {
        console.error("Error:", error.message);
    }

    navigation.goBack();
};

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.exitButton} onPress={exitCamera}>
            <Ionicons name="ios-close" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
            <Ionicons name="ios-reverse-camera" size={32} color="white" />
          </TouchableOpacity>
          {capturedPhoto ? (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={acceptPhoto}
              disabled={isTakingPhoto}
            >
              <Ionicons style={styles.checkMarkButton} name="checkmark-circle" size={32} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePhoto}
              disabled={isTakingPhoto}
            >
              {isTakingPhoto ? (
                <View style={styles.captureButtonInner} />
              ) : (
                <Ionicons name="ios-camera" size={70} color="white" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </Camera>
      {capturedPhoto && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Captured Photo:</Text>
          <View style={styles.previewImageContainer}>
            <Image
              source={{ uri: capturedPhoto.uri }}
              style={styles.previewImage}
            />
          </View>
        </View>
      )}
    </View>
  );
};
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: "transparent",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    exitButton: {
      alignSelf: "flex-end",
      alignItems: "center",
      marginBottom: 10,
    },
    flipButton: {
      alignSelf: "flex-end",
      alignItems: "center",
      marginBottom: 10,
    },
    captureButton: {
      alignSelf: "flex-end",
      alignItems: "center",
      marginBottom: 10,
    },
    captureButtonInner: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#fff",
    },
    previewContainer: {
      alignItems: "center",
    },
    previewText: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    previewImageContainer: {
      width: 200,
      height: 200,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    previewImage: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
    },
    checkMarkButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    bottomRightButtonText: {
      color: "white",
      fontSize: 16,
    },
  });
  
  export default CameraScreen;