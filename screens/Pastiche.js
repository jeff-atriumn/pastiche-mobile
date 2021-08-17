import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Camera } from "expo-camera";
import AnimatedLoader from "react-native-animated-loader";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { s3Upload } from "../libs/awsLib";
import { API } from "aws-amplify";

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
  const [photoSource, setPhotoSource] = useState(null);
  const [activeOverlays, setActiveOverlays] = useState({});
  const [currentOverlay, setCurrentOverlay] = useState(0);

  useEffect(() => {
    async function getOverlays() {
      const data = await API.get("overlays", "/overlays");
      setActiveOverlays({ overlays: data.body });
    }

    onHandlePermission();
    getOverlays();
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
      const options = { quality: 1.0, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.base64;

      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        // setPhotoSource(source);
        setPhotoData({
          lat: 50,
          long: 22,
          alt: 77,
          // overlayId: activeOverlays.overlays[0].overlayId,
          source: source,
        });
      }
    }
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
  };

  const previousOverlay = async () => {
    if (currentOverlay == 0) {
      setCurrentOverlay(activeOverlays.overlays.length - 1);
    } else {
      setCurrentOverlay(currentOverlay - 1);
    }
  };

  const nextOverlay = async () => {
    if (currentOverlay == activeOverlays.overlays.length - 1) {
      setCurrentOverlay(0);
    } else {
      setCurrentOverlay(currentOverlay + 1);
    }
  };

  const upload = async () => {
    setIsUploading(true);

    const photoUrl = photoData.source ? await s3Upload(photoData.source) : null;

    portrait = {
      lat: photoData.lat,
      long: photoData.long,
      alt: photoData.alt,
      overlayId: activeOverlays.overlays[0].overlayId,
      image: photoUrl,
    };

    API.post("portraits", `/portraits`, {
      body: portrait,
    }).catch((error) => {
      console.log(error.response);
    });

    setIsPreview(false);
    setIsCameraReady(true);
    setIsUploading(false);

    await cameraRef.current.resumePreview();
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
        >
          {Object.keys(activeOverlays).length > 0 && (
            <Image
              style={{
                width: 350,
                height: 250,
              }}
              source={{
                uri: activeOverlays.overlays[currentOverlay].overlayUrl,
              }}
            />
          )}
        </Camera>
      </View>
      <View style={styles.container}>
        {isPreview && (
          <View>
            <Image
              style={{
                width: 350,
                height: 250,
              }}
              source={{
                uri: activeOverlays.overlays[currentOverlay].overlayUrl,
              }}
            />
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
        {isUploading && (
          <AnimatedLoader
            visible={true}
            overlayColor="rgba(255,255,255,0.75)"
            source={require("../assets/60041-upload.json")}
            animationStyle={styles.lottie}
            speed={1}
          >
            <Text>Doing something...</Text>
          </AnimatedLoader>
        )}
        {!isPreview && (
          <View style={styles.container}>
            <View style={styles.overlayNavContainer}>
              <TouchableOpacity
                disabled={!isCameraReady}
                onPress={previousOverlay}
              >
                <AntDesign name="stepbackward" size={32} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity disabled={!isCameraReady} onPress={nextOverlay}>
                <AntDesign name="stepforward" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomButtonsContainer}>
              <TouchableOpacity
                disabled={!isCameraReady}
                onPress={switchCamera}
              >
                <MaterialIcons name="flip-camera-ios" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!isCameraReady}
                onPress={onSnap}
                style={styles.capture}
              />
            </View>
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
  lottie: {
    width: 100,
    height: 100,
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
  overlayNavContainer: {
    position: "absolute",
    flexDirection: "row",
    bottom: 175,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
