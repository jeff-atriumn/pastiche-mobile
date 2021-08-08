import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import { Auth } from "aws-amplify";

export default class AuthLoading extends React.Component {
  componentDidMount = async () => {
    await this.loadApp();
  };

  loadApp = async () => {
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        AsyncStorage.clear();
        this.setState({
          userToken: user.signInUserSession.accessToken.jwtToken,
        });
      })
      .then((data) => {
        this.props.navigation.navigate("App");
      })
      .catch((err) => {
        this.props.navigation.navigate("Auth");
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
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
