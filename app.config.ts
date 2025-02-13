import dotenv from 'dotenv';
dotenv.config();

export default {
  expo: {
    name: 'Notify Me',
    slug: 'notify-me',
    extra: {
      googleWebClientId: process.env.CLIENT_ID_WEB,
      apiBaseUrl: process.env.API_BASE_URL,
      serviceEmailAccount: process.env.SERVICE_EMAIL_ACCOUNT,
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
  },
};