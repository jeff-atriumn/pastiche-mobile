import React from "react";
import { Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Icon } from "../components";
import { nowTheme } from "../constants";

// screens
import PasticheCamera from "../screens/PasticheCamera";
import AuthLoading from "../screens/AuthLoading";
import Pro from "../screens/Pro";
import World from "../screens/World";
import MyPhotos from "../screens/MyPhotos";
import Portraits from "../screens/Portraits";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import ConfirmSignUp from "../screens/ConfirmSignUp";
import Login from "../screens/Login";
import Components from "../screens/Components";
import Articles from "../screens/Articles";
import Trending from "../screens/Trending";
import Fashion from "../screens/Fashion";
import Category from "../screens/Category";
import Product from "../screens/Product";
import Gallery from "../screens/Gallery";
import NotificationsScreen from "../screens/Notifications";
import Agreement from "../screens/Agreement";
import About from "../screens/About";
import Privacy from "../screens/Privacy";
import Chat from "../screens/Chat";
import Cart from "../screens/Cart";
import Search from "../screens/Search";
import SettingsScreen from "../screens/Settings";

import PersonalNotifications from "../screens/PersonalNotifications";
import SystemNotifications from "../screens/SystemNotifications";

// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import Header from "../components/Header";
import tabs from "../constants/tabs";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// function NotificationsStack(props) {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color }) => {
//           let iconName;
//           if (route.name === "Personal") {
//             iconName = "single";
//           } else if (route.name === "System") {
//             iconName = "paper";
//           }
//           // You can return any component that you like here!
//           return (
//             <Icon
//               name={iconName}
//               family="NowExtra"
//               size={22}
//               color={color}
//               style={{ marginTop: 10 }}
//             />
//           );
//         },
//       })}
//       tabBarOptions={{
//         activeTintColor: nowTheme.COLORS.PRIMARY,
//         inactiveTintColor: nowTheme.COLORS.TIME,
//         labelStyle: {
//           fontFamily: "montserrat-regular",
//         },
//         style: { borderTopWidth: "0px", paddingHorizonal: 35 },
//       }}
//     >
//       <Tab.Screen name="Personal" component={PersonalNotifications} />
//       <Tab.Screen name="System" component={SystemNotifications} />
//     </Tab.Navigator>
//   );
// }

// function ComponentsStack(props) {
//   return (
//     <Stack.Navigator mode="card" headerMode="screen">
//       <Stack.Screen
//         name="Components"
//         component={Components}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header title="Components" navigation={navigation} scene={scene} />
//           ),
//           cardStyle: { backgroundColor: "#FFFFFF" },
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

function SettingsStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Settings" scene={scene} navigation={navigation} />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="Agreement"
        component={Agreement}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Agreement"
              scene={scene}
              navigation={navigation}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Privacy"
              scene={scene}
              navigation={navigation}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title="About" scene={scene} navigation={navigation} />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Shopping Cart"
              scene={scene}
              navigation={navigation}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
    </Stack.Navigator>
  );
}

// function ArticlesStack(props) {
//   return (
//     <Stack.Navigator mode="card" headerMode="screen">
//       <Stack.Screen
//         name="Articles"
//         component={Articles}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header title="Articles" navigation={navigation} scene={scene} />
//           ),
//           cardStyle: { backgroundColor: "#FFFFFF" },
//         }}
//       />
//       <Stack.Screen
//         name="Product"
//         component={Product}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               title=""
//               back
//               black
//               transparent
//               navigation={navigation}
//               scene={scene}
//             />
//           ),
//           headerTransparent: true,
//         }}
//       />
//       <Stack.Screen
//         name="Gallery"
//         component={Gallery}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               back
//               transparent
//               white
//               title=""
//               navigation={navigation}
//               scene={scene}
//             />
//           ),
//           headerTransparent: true,
//         }}
//       />
//       <Stack.Screen
//         name="Chat"
//         component={Chat}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               title="Rachel Brown"
//               back
//               navigation={navigation}
//               scene={scene}
//             />
//           ),
//           cardStyle: { backgroundColor: "#FFFFFF" },
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Profile"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Shopping Cart"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
    </Stack.Navigator>
  );
}

function WorldStack(props) {
  return (
    <Stack.Navigator initialRouteName="World" mode="card" headerMode="screen">
      <Stack.Screen
        name="World"
        component={World}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="World"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function MyPhotosStack(props) {
  return (
    <Stack.Navigator initialRouteName="World" mode="card" headerMode="screen">
      <Stack.Screen
        name="MyPhotos"
        component={MyPhotos}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="My Photos"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function CameraStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen" initialRouteName="Camera">
      <Stack.Screen
        name="Camera"
        component={PasticheCamera}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Camera"
              // search
              // options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="Trending"
        component={Trending}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Trending"
              back
              tabs={tabs.trending}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="Category"
        component={Category}
        options={{
          header: ({ navigation, scene }) => {
            const { params } = scene.descriptor;
            const title = (params && params.headerTitle) || "Category";
            return (
              <Header
                title={title}
                back
                navigation={navigation}
                scene={scene}
              />
            );
          },
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="Fashion"
        component={Fashion}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Fashion"
              back
              tabs={tabs.fashion}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="Product"
        component={Product}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              black
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Gallery"
        component={Gallery}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              transparent
              white
              title=""
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Rachel Brown"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Search" back navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Shopping Cart"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: nowTheme.COLORS.PRIMARY,
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: nowTheme.COLORS.WHITE,
        inactiveTintColor: nowTheme.COLORS.WHITE,
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
      initialRouteName="PasticheCamera"
    >
      <Drawer.Screen name="Camera" component={CameraStack} />
      <Drawer.Screen name="My Photos" component={MyPhotosStack} />
      <Drawer.Screen name="World" component={WorldStack} />
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="Settings" component={SettingsStack} />
    </Drawer.Navigator>
  );
}

function AuthStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Register"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="ConfirmSignUp"
        component={ConfirmSignUp}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Confirm"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Login"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="AuthLoading"
        component={AuthLoading}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}
