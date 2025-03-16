import dotenv from 'dotenv';
dotenv.config();

export default {
  expo: {
    name: 'Notify Me',
    slug: 'notify-me',
    extra: {
      eas: {
        projectId: "3b595170-cb5a-41b6-a144-817dc81c44ee"
      },
      googleWebClientId: process.env.CLIENT_ID_WEB,
      apiBaseUrl: process.env.API_BASE_URL,
      serviceEmailAccount: process.env.SERVICE_EMAIL_ACCOUNT,
    },
  },
};