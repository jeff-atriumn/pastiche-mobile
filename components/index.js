import Button from "./Button";
import Card from "./Card";
import DrawerItem from "./DrawerItem";
import Icon from "./Icon";
import Header from "./Header";
import Input from "./Input";
import Switch from "./Switch";
import Select from "./Select";
import Notification from "./Notification";

export {
  Button,
  Card,
  DrawerItem,
  Icon,
  Input,
  Header,
  Switch,
  Select,
  Notification,
};

import Amplify from "aws-amplify";
import config from "../config.js";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "portraits",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
      {
        name: "overlays",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
  Storage: {
    AWSS3: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
    },
  },
});
