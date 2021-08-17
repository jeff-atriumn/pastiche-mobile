import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import { Block, Text, theme, Button as GaButton } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

import { Button } from "../components";
import { Images, nowTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { API, Storage } from "aws-amplify";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function Featured() {
  const [activeOverlays, setActiveOverlays] = useState({});

  useEffect(() => {
    async function getOverlays() {
      const data = await API.get("overlays", "/overlays");
      setActiveOverlays({ overlays: data.body });
    }

    getOverlays();
  }, []);

  return (
    <LinearGradient
      colors={["indigo", "grey"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
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
                    activeOverlays.overlays.map((img, imgIndex) => (
                      <Image
                        source={{ uri: img.overlayUrl }}
                        key={`viewed-${img.overlayUrl}`}
                        resizeMode="cover"
                        style={styles.thumb}
                      />
                    ))}
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
  profileContainer: {
    width,
    height,
    padding: 0,
    zIndex: 1,
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
});

// export default Featured;
