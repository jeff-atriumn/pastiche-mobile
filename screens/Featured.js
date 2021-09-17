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
} from "react-native";
import { Block, Text, theme, Button as GaButton } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Carousel from "pinar";
import { Button } from "../components";
import { Images, nowTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { API, Storage } from "aws-amplify";
import { S3Image } from "aws-amplify-react-native";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function Featured() {
  const [activeOverlays, setActiveOverlays] = useState({});
  const [isPortrait, setPortrait] = useState(false);
  const [overlay, setOverlay] = useState(null);
  const [activePastiche, setActivePastiche] = useState([]);
  // const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function getOverlays() {
      const data = await API.get("overlays", "/overlays");
      setActiveOverlays({ overlays: data.body });
    }

    getOverlays();
  }, []);

  async function showPortrait(id) {
    console.log(id);

    setPortrait(true);
    setOverlay(id);
    const data = await API.get("pastiche", "/pastiche/" + id);

    console.log(data.body);

    photos = [];
    for (d in data.body) {
      photo = {};
      await Storage.get(data.body[d].portrait, {
        level: "protected",
      })
        .then((image) => {
          photo.photoUrl = image;
          photo.latitude = data.body[d].latitude;
          photos.push(photo);
        })
        .catch((err) => console.log(err));
    }

    setActivePastiche(photos);
  }

  const cancelPortrait = async () => {
    setPortrait(false);
    setOverlay(null);
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
                    activeOverlays.overlays.map((img, imgIndex) => (
                      <TouchableOpacity
                        key={`button-${img.overlayUrl}`}
                        onPress={() => showPortrait(img.overlayId)}
                      >
                        <Image
                          source={{ uri: img.overlayUrl }}
                          key={`viewed-${img.overlayUrl}`}
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
                              {/* <S3Image imgKey={pas.photoUrl} /> */}
                              <Image
                                style={styles.image}
                                source={{ uri: pas.photoUrl }}
                                key={`img-${pasIndex}`}
                              />
                              {/* <Text key={`viewed-${pasIndex}`}>
                                {pas.photoUrl}
                              </Text> */}
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

// export default Featured;
