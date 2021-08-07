export default {
  MAX_IMAGE_SIZE: 5000000,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  s3: {
    REGION: "us-east-2",
    BUCKET: "pastiche-upload",
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://pe56jofkmk.execute-api.us-east-2.amazonaws.com/prod",
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_LDF62e9UX",
    APP_CLIENT_ID: "1r79p8ba0runakud5lr0njsqa0",
    IDENTITY_POOL_ID: "us-east-2:e639c93a-4e30-4010-9474-49429749eded",
  },
};
