import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Block,
  Checkbox,
  Text,
  Button as GaButton,
  theme,
} from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, nowTheme } from "../constants";
import { Auth } from "aws-amplify";

const { width, height } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class Register extends React.Component {
  // state = { isAuthenticated: useAppContext() };
  constructor(props) {
    super(props);
    this.state = {
      given_name: "",
      family_name: "",
      email: "",
      password: "",
      confirmationCode: "",
      // modalVisible: false,
      // isAuthenticated: false,
    };
  }

  handleSubmit = async () => {
    // const { email, password, name } = this.state;
    this.setState({ isLoading: true });

    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password,
        attributes: {
          given_name: this.state.given_name,
          family_name: this.state.family_name,
        },
      });
      this.setState({
        newUser,
      });
    } catch (e) {
      alert(e.message);
    }

    this.setState({ isLoading: false });
    this.props.navigation.navigate("ConfirmSignUp", {
      email: this.state.email,
      password: this.state.password,
    });
  };

  handleLogin = async () => {
    this.props.navigation.navigate("Login");
  };

  onChangeText(key, value) {
    this.setState({ [key]: value });
  }

  render() {
    return (
      <DismissKeyboard>
        <Block flex middle>
          <ImageBackground
            source={Images.RegisterBackground}
            style={styles.imageBackgroundContainer}
            imageStyle={styles.imageBackground}
          >
            <Block flex middle>
              <Block style={styles.registerContainer}>
                <Block flex space="evenly">
                  <Block flex={0.4} middle style={styles.socialConnect}>
                    <Block flex={0.5} middle>
                      <Text
                        style={{
                          fontFamily: "montserrat-regular",
                          textAlign: "center",
                        }}
                        color="#333"
                        size={24}
                      >
                        Sign Up
                      </Text>
                    </Block>
                  </Block>
                  <Block flex={1} middle space="between">
                    <Block center flex={0.9}>
                      <Block flex space="between">
                        <Block>
                          <Block
                            width={width * 0.8}
                            style={{ marginBottom: 5 }}
                          >
                            <Input
                              placeholder="First Name"
                              style={styles.inputs}
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="profile-circle"
                                  family="NowExtra"
                                  style={styles.inputIcons}
                                />
                              }
                              onChangeText={(value) =>
                                this.onChangeText("given_name", value)
                              }
                            />
                          </Block>
                          <Block
                            width={width * 0.8}
                            style={{ marginBottom: 5 }}
                          >
                            <Input
                              placeholder="Last Name"
                              style={styles.inputs}
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="caps-small2x"
                                  family="NowExtra"
                                  style={styles.inputIcons}
                                />
                              }
                              onChangeText={(value) =>
                                this.onChangeText("family_name", value)
                              }
                            />
                          </Block>
                          <Block width={width * 0.8}>
                            <Input
                              placeholder="Email"
                              autoCapitalize="none"
                              style={styles.inputs}
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="email-852x"
                                  family="NowExtra"
                                  style={styles.inputIcons}
                                />
                              }
                              onChangeText={(value) =>
                                this.onChangeText("email", value)
                              }
                            />
                          </Block>
                          <Block width={width * 0.8}>
                            <Input
                              placeholder="Password"
                              secureTextEntry={true}
                              style={styles.inputs}
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="lock-circle-open2x"
                                  family="NowExtra"
                                  style={styles.inputIcons}
                                />
                              }
                              onChangeText={(value) =>
                                this.onChangeText("password", value)
                              }
                            />
                          </Block>
                        </Block>
                        <Block center>
                          <Button
                            color="primary"
                            onPress={() => this.handleSubmit()}
                            round
                            style={styles.createButton}
                          >
                            <Text
                              style={{ fontFamily: "montserrat-bold" }}
                              size={14}
                              color={nowTheme.COLORS.WHITE}
                            >
                              Send Confirmation
                            </Text>
                          </Button>
                        </Block>
                        <Block center>
                          <Button
                            color="primary"
                            onPress={() => this.handleLogin()}
                            round
                            style={styles.createButton}
                          >
                            <Text
                              style={{ fontFamily: "montserrat-bold" }}
                              size={14}
                              color={nowTheme.COLORS.WHITE}
                            >
                              Login
                            </Text>
                          </Button>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
          </ImageBackground>
        </Block>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  imageBackground: {
    width: width,
    height: height,
  },
  registerContainer: {
    marginTop: 55,
    width: width * 0.9,
    height: height < 812 ? height * 0.8 : height * 0.8,
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 4,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  socialConnect: {
    backgroundColor: nowTheme.COLORS.WHITE,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    color: nowTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT,
  },
  inputs: {
    borderWidth: 1,
    borderColor: "#E3E3E3",
    borderRadius: 21.5,
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center",
    marginHorizontal: 10,
  },
});

export default Register;
