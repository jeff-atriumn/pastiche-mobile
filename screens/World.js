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
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Carousel from "pinar";
import { Button } from "../components";
import { Images, nowTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { API, Storage } from "aws-amplify";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 4;

export default function World() {
  const [activeOverlays, setActiveOverlays] = useState({});
  const [isPortrait, setPortrait] = useState(false);
  const [overlay, setOverlay] = useState({});
  const [activePastiche, setActivePastiche] = useState([]);
  const [displayAddress, setDisplayAddress] = useState(null);
  const [featuredOverlays, setFeaturedOverlays] = useState([]);
  const [sponsoredOverlays, setSponsoredOverlays] = useState([]);

  useEffect(() => {
    async function getOverlays() {
      const data = await API.get("overlays", "/overlays");
      setActiveOverlays({
        overlays: data.body.filter(
          (x) =>
            x.featured != "true" && x.sponsored != "true" && x.active === "true"
        ),
      });
      setFeaturedOverlays({
        overlays: data.body.filter(
          (x) => x.featured === "true" && x.active === "true"
        ),
      });
      setSponsoredOverlays({
        overlays: data.body.filter(
          (x) => x.sponsored === "true" && x.active === "true"
        ),
      });
    }

    console.log(sponsoredOverlays);
    getOverlays();
  }, []);

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
      colors={["indigo", "grey"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, styles.linear]}
    >
      <Block
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
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
                <Block row space="between">
                  <ScrollView horizontal={true}>
                    {Object.keys(featuredOverlays).length > 0 &&
                      !isPortrait &&
                      featuredOverlays.overlays.map((overlay, imgIndex) => (
                        <TouchableOpacity
                          key={`button-${overlay.overlayUrl}`}
                          onPress={() => showPortrait(overlay)}
                          style={{ padding: 5 }}
                        >
                          {overlay.featured == "true" && (
                            <AntDesign
                              name="star"
                              size={16}
                              color="yellow"
                              style={{
                                zIndex: 99,
                                marginTop: 20,
                                marginLeft: -1,
                                position: "absolute",
                              }}
                            />
                          )}
                          <Image
                            source={{ uri: overlay.overlayUrl }}
                            key={`viewed-${overlay.overlayUrl}`}
                            resizeMode="cover"
                            style={styles.thumb}
                          />
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </Block>
                <Block row space="between">
                  <ScrollView horizontal={true}>
                    {Object.keys(sponsoredOverlays).length > 0 &&
                      !isPortrait &&
                      sponsoredOverlays.overlays.map((overlay, imgIndex) => (
                        <TouchableOpacity
                          key={`button-${overlay.overlayUrl}`}
                          onPress={() => showPortrait(overlay)}
                          style={{ padding: 5 }}
                        >
                          {overlay.sponsored == "true" && (
                            <FontAwesome5
                              name="adversal"
                              size={16}
                              color="yellow"
                              style={{
                                zIndex: 99,
                                marginTop: 20,
                                position: "absolute",
                              }}
                            />
                          )}
                          <Image
                            source={{ uri: overlay.overlayUrl }}
                            key={`viewed-${overlay.overlayUrl}`}
                            resizeMode="cover"
                            style={styles.thumb}
                          />
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </Block>
                <Block row space="between">
                  <ScrollView horizontal={true}>
                    {Object.keys(activeOverlays).length > 0 &&
                      !isPortrait &&
                      activeOverlays.overlays.map((overlay, imgIndex) => (
                        <TouchableOpacity
                          key={`button-${overlay.overlayUrl}`}
                          onPress={() => showPortrait(overlay)}
                          style={{ padding: 5 }}
                        >
                          {overlay.sponsored == "true" && (
                            <FontAwesome5
                              name="adversal"
                              size={16}
                              color="yellow"
                              style={{
                                zIndex: 99,
                                marginTop: 20,
                                position: "absolute",
                              }}
                            />
                          )}
                          <Image
                            source={{ uri: overlay.overlayUrl }}
                            key={`viewed-${overlay.overlayUrl}`}
                            resizeMode="cover"
                            style={styles.thumb}
                          />
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </Block>
        {isPortrait && (
          <Block style={styles.square}>
            <Carousel style={styles.carousel}>
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
                          width: Dimensions.get("window").width * 0.35,
                          height: Dimensions.get("window").height * 0.25,
                        }}
                        source={{
                          uri: overlay.overlayUrl,
                        }}
                      />
                    </ImageBackground>
                    <Block style={styles.location}>
                      <Block>
                        <Text
                          style={{ fontFamily: "montserrat-bold" }}
                          size={14}
                          color={nowTheme.COLORS.BLACK}
                        >
                          {pas.city} {pas.region}
                        </Text>
                        <Text
                          style={{ fontFamily: "montserrat-regular" }}
                          size={14}
                          color={nowTheme.COLORS.BLACK}
                        >
                          {pas.country}
                        </Text>
                      </Block>
                    </Block>
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
  carousel: {
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
    marginTop: 150,
    flex: 1,
    paddingBottom: 75,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  image: {
    height: Dimensions.get("window").width * 0.9,
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
    marginHorizontal: 5,
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // paddingLeft: 10,
    // paddingRight: 10,
    borderRadius: 10,
  },
});

// export default Featured;
