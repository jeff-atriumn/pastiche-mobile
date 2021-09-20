import React from "react";
import { StyleSheet, FlatList, TouchableOpacity, View } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Switch, Icon } from "../components";

import nowTheme from "../constants/Theme";

export default class Settings extends React.Component {
  state = {};

  toggleSwitch = (switchNumber) =>
    this.setState({ [switchNumber]: !this.state[switchNumber] });

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;

    switch (item.type) {
      case "switch":
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text style={styles.settingOption}>{item.title}</Text>
            <Switch
              onValueChange={() => this.toggleSwitch(item.id)}
              value={this.state[item.id]}
            />
          </Block>
        );
      case "button":
        return (
          <Block style={styles.rows}>
            <TouchableOpacity
              onPress={() => {
                if (item.id !== "Payment" && item.id !== "gift")
                  navigate(item.id);
              }}
            >
              <Block row middle space="between" style={{ paddingTop: 7 }}>
                <Text style={styles.settingOption}>{item.title}</Text>
                <Icon
                  name="minimal-right2x"
                  family="NowExtra"
                  style={{ paddingRight: 5 }}
                />
              </Block>
            </TouchableOpacity>
          </Block>
        );
      default:
        break;
    }
  };

  render() {
    const privacy = [
      { title: "User Agreement", id: "Agreement", type: "button" },
      { title: "Privacy", id: "Privacy", type: "button" },
      { title: "About", id: "About", type: "button" },
    ];

    return (
      <View style={styles.settings}>
        <Block center style={styles.title}>
          <Text style={styles.titleText}>Important Privacy Settings</Text>
        </Block>
        <FlatList
          data={privacy}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settings: {
    paddingVertical: theme.SIZES.BASE / 3,
    backgroundColor: nowTheme.COLORS.WHITE,
  },
  title: {
    paddingTop: theme.SIZES.BASE * 2,
    paddingBottom: theme.SIZES.BASE,
  },
  titleText: {
    fontFamily: "montserrat-regular",
    paddingBottom: 5,
    fontSize: nowTheme.SIZES.FONT,
    fontWeight: "500",
    color: nowTheme.COLORS.HEADER,
    lineHeight: 20,
  },
  subtitleText: {
    fontFamily: "montserrat-regular",
    fontSize: 14,
    color: nowTheme.COLORS.TIME,
    lineHeight: 17,
  },
  settingOption: {
    fontFamily: "montserrat-regular",
    fontSize: 16,
    color: nowTheme.COLORS.HEADER,
    lineHeight: 20,
  },
  rows: {
    height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2,
  },
});
