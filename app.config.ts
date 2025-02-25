import dotenv from 'dotenv';
dotenv.config();

export default {
  expo: {
    name: 'Notify Me',
    slug: 'notify-me',
    extra: {
      "eas": {
        "projectId": "67cc68b5-c602-4881-9a67-8128d851440a"
      },
      googleWebClientId: process.env.CLIENT_ID_WEB,
      apiBaseUrl: process.env.API_BASE_URL,
      serviceEmailAccount: process.env.SERVICE_EMAIL_ACCOUNT,
    },
  },
};