import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Button } from "../components";
const { height, width } = Dimensions.get("screen");

import nowTheme from "../constants/Theme";
import Images from "../constants/Images";

class Pro extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex center>
          <ImageBackground
            source={Images.Pro}
            style={{ height, width, zIndex: 1 }}
          />
        </Block>

        <Block flex space="between" style={styles.padded}>
          <Block middle flex space="around" style={{ zIndex: 2 }}>
            <Block center style={styles.title}>
              <Block>
                <Text color="white" size={60} style={styles.font}>
                  Atriumn
                </Text>
              </Block>
            </Block>

            <Block row middle style={{ marginTop: theme.SIZES.BASE * 4 }}>
              {Platform.OS === "ios" ? (
                //if true
                <Image
                  source={Images.iOSLogo}
                  style={{
                    height: 38,
                    width: 82,
                    marginRight: theme.SIZES.BASE * 1.5,
                  }}
                />
              ) : (
                //if false
                <Image
                  source={Images.androidLogo}
                  style={{ height: 38, width: 140 }}
                />
              )}
            </Block>

            <Block center>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 12 }}
                style={styles.button}
                onPress={() => navigation.navigate("Profile")}
              >
                SIGN UP
              </Button>
              <Button
                textStyle={{ fontFamily: "montserrat-regular", fontSize: 12 }}
                style={styles.button}
                onPress={() => navigation.navigate("Profile")}
              >
                LOGIN
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
  },
  padded: {
    top: 270,
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "absolute",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
  },
  title: {
    marginTop: "-5%",
  },
  subTitle: {
    marginTop: 20,
  },
  pro: {
    backgroundColor: nowTheme.COLORS.BLACK,
    paddingHorizontal: 8,
    marginLeft: 3,
    borderRadius: 4,
    height: 22,
    marginTop: 0,
  },
  font: {
    fontFamily: "montserrat-bold",
  },
});

export default Pro;
