export default {
  MAX_IMAGE_SIZE: 5000000,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  s3: {
    REGION: "us-east-2",
    BUCKET: "atriumn-upload",
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://huir4kr64d.execute-api.us-east-2.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_4HEnjrK03",
    APP_CLIENT_ID: "5cj984fl2pjost26c8o3glv3q",
    IDENTITY_POOL_ID: "us-east-2:bb503bbd-0abf-4be1-b1dc-c5baebac45a8",
  },
};
