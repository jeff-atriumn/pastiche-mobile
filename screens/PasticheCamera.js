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
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Swiper from "react-native-web-swiper";

import { s3Upload } from "../libs/awsLib";
import { API } from "aws-amplify";
import { Images, nowTheme } from "../constants";

const WINDOW_HEIGHT = Dimensions.get("window").height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

export default function PasticheCamera() {
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
  const [zoomValue, setZoomValue] = useState(0);
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  // const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
  //   "Wait, we are fetching you location..."
  // );
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [location, setLocation] = useState({
    lat: null,
    long: null,
    alt: null,
  });

  useEffect(() => {
    async function getOverlays() {
      const data = await API.get("overlays", "/overlays");
      setActiveOverlays({ overlays: data.body });
    }

    onHandlePermission();
    checkIfLocationEnabled();
    getOverlays();
  }, []);

  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        "Location Service not enabled",
        "Please enable your location services to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use location service.",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude, altitude } = coords;

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        setLocation({
          lat: latitude,
          long: longitude,
          alt: altitude,
          city: item.city,
          region: item.region,
          country: item.country,
        });
      }
    }
  };

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
      getCurrentLocation();

      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        setPhotoData({
          source: source,
        });
      }
    }
  };

  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
  };

  const zoomIn = async () => {
    if (zoomValue <= 0.95) {
      setZoomValue(zoomValue + 0.005);
    }
  };

  const zoomOut = async () => {
    if (zoomValue >= 0.05) {
      setZoomValue(zoomValue - 0.005);
    }
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
      lat: location.lat,
      long: location.long,
      alt: location.alt,
      city: location.city,
      region: location.region,
      country: location.country,
      overlayId: activeOverlays.overlays[currentOverlay].overlayId,
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
          zoom={zoomValue}
        >
          {Object.keys(activeOverlays).length > 0 && (
            <Image
              style={{
                width: Dimensions.get("window").width * 0.35,
                height: Dimensions.get("window").height * 0.25,
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
          <View style={styles.location}>
            <TouchableOpacity
              onPress={cancelPreview}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={32} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text
                style={{ fontFamily: "montserrat-bold" }}
                size={14}
                color={nowTheme.COLORS.BLACK}
              >
                {location.city} {location.region}
              </Text>
              <Text
                style={{ fontFamily: "montserrat-regular" }}
                size={14}
                color={nowTheme.COLORS.BLACK}
              >
                {location.country}
              </Text>
            </View>
            <TouchableOpacity
              onPress={upload}
              style={styles.uploadButton}
              activeOpacity={0.7}
            >
              <Ionicons name="cloud-upload-outline" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        {isUploading && (
          <AnimatedLoader
            visible={true}
            overlayColor="rgba(0,0,0,0.75)"
            source={require("../assets/60041-upload.json")}
            animationStyle={styles.lottie}
            speed={1}
          >
            <Text>Uploading...</Text>
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
              <View>
                <TouchableOpacity disabled={!isCameraReady} onPress={zoomIn}>
                  <MaterialIcons name="zoom-in" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity disabled={!isCameraReady} onPress={zoomOut}>
                  <MaterialIcons name="zoom-out" size={28} color="white" />
                </TouchableOpacity>
              </View>
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
  location: {
    height: 70,
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "white",
    position: "absolute",
    zIndex: 99,
    bottom: Dimensions.get("window").height * 0.1,
    left: Dimensions.get("window").width * 0.1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
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
    height: Dimensions.get("window").width * 0.9,
    width: Dimensions.get("window").width * 0.9,
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
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "crimson",
    opacity: 0.7,
  },
  uploadButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "limegreen",
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
    borderWidth: 3,
    borderColor: "white",
  },
});
