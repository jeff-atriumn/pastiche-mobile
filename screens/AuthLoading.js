import React from "react";
import {
  StyleSheet,
  View,
  AsyncStorage,
  Text,
  ActivityIndicator,
} from "react-native";

import * as SecureStore from "expo-secure-store";

import { Auth } from "aws-amplify";

export default class AuthLoading extends React.Component {
  componentDidMount = async () => {
    await this.loadApp();
  };

  loadApp = async () => {
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        this.setState({
          userToken: user.signInUserSession.accessToken.jwtToken,
        });
      })
      .then((data) => {
        console.log("going to app");
        this.props.navigation.navigate("App");
      })
      .catch((err) => {
        console.log("going to auth");
        this.props.navigation.navigate("Auth");
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text>HI HI HI HI</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aa73b7",
    alignItems: "center",
    justifyContent: "center",
  },
});
