import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { s3Upload } from "../libs/awsLib";
import { API, Storage } from "aws-amplify";

import config from "../config.js";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

export default function Pastiche() {
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoData, setPhotoData] = useState(null);

  useEffect(() => {
    onHandlePermission();
  }, []);

  const onHandlePermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const onSnap = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.base64;

      if (source) {
        await cameraRef.current.pausePreview();
        setPhotoData({
          image: "test portrait",
          lat: 50,
          long: 22,
          alt: 77,
          overlayId: "test overlay",
          source: source,
        });
        // setPhotoData({ photo: data });
        setIsPreview(true);

        // let base64Img = `data:image/jpg;base64,${source}`;
        // let apiUrl =
        //   "https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload";
        // let data = {
        //   file: base64Img,
        //   upload_preset: "<your-upload-preset>",
        // };

        // fetch(apiUrl, {
        //   body: JSON.stringify(data),
        //   headers: {
        //     "content-type": "application/json",
        //   },
        //   method: "POST",
        // })
        //   .then(async (response) => {
        //     let data = await response.json();
        //     if (data.secure_url) {
        //       alert("Upload successful");
        //     }
        //   })
        //   .catch((err) => {
        //     alert("Cannot upload");
        //     console.log(err);
        //   });
      }
    }
  };

  const createPortrait = async () => {
    return API.post("portraits", `/portraits`, {
      body: photoData,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
  };

  const upload = async () => {
    setIsUploading(true);

    console.log("before upload");
    console.log([photoData]);
    const photoUrl = photoData.source ? await s3Upload(photoData.source) : null;
    console.log("after upload");

    createPortrait();

    // createPortrait({
    //   portrait: "test-pastiche.jpg",
    //   overlayId: "SLJGHSJFHDSJjhFSDF",
    //   lat: 50,
    //   long: 75,
    //   alt: 200,
    // });

    setIsPreview(false);
    setIsCameraReady(true);
    setIsUploading(false);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <LinearGradient
      colors={["seagreen", "grey"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, styles.linear]}
    >
      <View style={styles.square}>
        <Camera
          ref={cameraRef}
          style={[styles.camera]}
          type={cameraType}
          onCameraReady={onCameraReady}
          useCamera2Api={true}
        />
      </View>
      <View style={styles.container}>
        {isPreview && (
          <View>
            <TouchableOpacity
              onPress={cancelPreview}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={upload}
              style={styles.uploadButton}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowup" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        {!isPreview && (
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
              <MaterialIcons name="flip-camera-ios" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={!isCameraReady}
              onPress={onSnap}
              style={styles.capture}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  linear: {
    backgroundColor: "green",
  },
  square: {
    flex: 1,
    paddingBottom: 75,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    height: Dimensions.get("window").width * 0.95,
    width: Dimensions.get("window").width * 0.95,
    borderRadius: 5,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  text: {
    color: "#fff",
  },
  bottomButtonsContainer: {
    position: "absolute",
    flexDirection: "row",
    bottom: 28,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 35,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5A45FF",
    opacity: 0.7,
  },
  uploadButton: {
    position: "absolute",
    top: 95,
    right: 20,
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "tomato",
    opacity: 0.7,
  },
  capture: {
    backgroundColor: "#5A45FF",
    borderRadius: 5,
    height: CAPTURE_SIZE,
    width: CAPTURE_SIZE,
    borderRadius: Math.floor(CAPTURE_SIZE / 2),
    marginBottom: 28,
    marginHorizontal: 30,
  },
});
