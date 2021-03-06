import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  TouchableOpacity,
  ImageBackgroundBase,
} from "react-native";
import { Block, Text, theme, Button as GaButton } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Carousel from "pinar";
import { Button } from "../components";
import { Images, nowTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { API, Storage } from "aws-amplify";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function MyPhotos() {
  const [activeOverlays, setActiveOverlays] = useState({});
  const [isPortrait, setPortrait] = useState(false);
  const [overlay, setOverlay] = useState({});
  const [activePastiche, setActivePastiche] = useState([]);
  const [displayAddress, setDisplayAddress] = useState(null);

  useEffect(() => {
    async function getOverlays() {
      const data = await API.get("overlays", "/overlays");
      setActiveOverlays({ overlays: data.body });
    }

    getOverlays();
  }, []);

  async function getLocation(loc) {
    let response = await Location.reverseGeocodeAsync({
      latitude: loc.lat,
      longitude: loc.long,
    });

    for (let item of response) {
      let address = `${item.city}, ${item.region}, ${item.country}`;

      setDisplayAddress(address);
    }
  }

  async function showPortrait(over) {
    setPortrait(true);
    setOverlay(over);
    const data = await API.get("pastiche", "/pastiche/" + over.overlayId);

    photos = [];
    for (d in data.body) {
      photo = {};
      await Storage.get(data.body[d].portrait, {
        level: "protected",
      })
        .then((image) => {
          photo.photoUrl = image;
          photo.location = getLocation({
            lat: data.body[d].latitude,
            long: data.body[d].longitude,
          });
          photos.push(photo);
        })
        .catch((err) => console.log(err));
    }

    setActivePastiche(photos);
  }

  const cancelPortrait = async () => {
    setPortrait(false);
    setOverlay({});
  };

  return (
    <LinearGradient
      colors={["black", "grey"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, styles.linear]}
    >
      <Block
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Block flex={1} style={{ padding: theme.SIZES.BASE, marginTop: 90 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Block flex style={{ marginTop: 20 }}>
              <Block
                row
                style={{ paddingVertical: 14, paddingHorizontal: 15 }}
                space="between"
              ></Block>

              <Block
                style={{
                  paddingBottom: -HeaderHeight * 2,
                  paddingHorizontal: 15,
                }}
              >
                <Block row space="between" style={{ flexWrap: "wrap" }}>
                  {Object.keys(activeOverlays).length > 0 &&
                    !isPortrait &&
                    activeOverlays.overlays.map((overlay, imgIndex) => (
                      <TouchableOpacity
                        key={`button-${overlay.overlayUrl}`}
                        onPress={() => showPortrait(overlay)}
                      >
                        <Image
                          source={{ uri: overlay.overlayUrl }}
                          key={`viewed-${overlay.overlayUrl}`}
                          resizeMode="cover"
                          style={styles.thumb}
                        />
                      </TouchableOpacity>
                    ))}
                  {isPortrait && (
                    <Block style={styles.square}>
                      <Carousel>
                        {Object.keys(activePastiche).length > 0 &&
                          activePastiche.map((pas, pasIndex) => (
                            <Block key={`block-${pasIndex}`}>
                              <ImageBackground
                                style={styles.image}
                                source={{ uri: pas.photoUrl }}
                                key={`img-${pasIndex}`}
                              >
                                <Image
                                  style={{
                                    width: 350,
                                    height: 250,
                                  }}
                                  source={{
                                    uri: overlay.overlayUrl,
                                  }}
                                />
                                <Text key={`address-${pasIndex}`}>
                                  {displayAddress}
                                </Text>
                              </ImageBackground>
                            </Block>
                          ))}
                      </Carousel>
                      <TouchableOpacity
                        onPress={cancelPortrait}
                        style={styles.closeButton}
                        activeOpacity={0.7}
                      >
                        <AntDesign name="close" size={32} color="#fff" />
                      </TouchableOpacity>
                    </Block>
                  )}
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </Block>
      </Block>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  profileContainer: {
    width,
    height,
    padding: 0,
    zIndex: 1,
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
  profileBackground: {
    width,
    height: height * 0.6,
  },

  info: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  thumb: {
    borderRadius: 4,
    borderColor: "white",
    borderWidth: 0.5,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: "center",
    zIndex: 99,
    marginHorizontal: 5,
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
  image: {
    height: Dimensions.get("window").width * 0.95,
    width: Dimensions.get("window").width * 0.95,
    justifyContent: "center",
    zIndex: 99,
    marginHorizontal: 5,
  },
});
