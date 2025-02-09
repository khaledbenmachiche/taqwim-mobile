import httpRequest from '../utils/httpRequest';
import { SignUpData,SignInData } from './types';

const signUp = async ({email, password, username,lastName,firstName,phoneNumber}:SignUpData) => {
  try {
    const data = await httpRequest('/app/authentification/signup', 'POST', {
      email,
      password,
      username,
      last_name:lastName,
      first_name:firstName,
      phone_number:phoneNumber
    });

    return {
      success: true,
      userInfo: {
        id: data.id,
        email: data.email,
        username: data.username,
        lastName: data.last_name,
        firstName: data.first_name,
        phoneNumber: data.phone_number,
      },
      error: null,
    };
  } catch (error:any) {
    return {
      success: false,
      userInfo: null,
      error: error.message,
    };
  }
};

const signIn = async ({username, password}:SignInData) => {
  try {
    const data = await httpRequest('/app/authentification/login', 'POST', {
      username,
      password,
    });

    return {
      success: true,
      userInfo: {
          id: data.id,
          email: data.email,
          username: data.username,
          lastName: data.last_name,
          firstName: data.first_name,
          phoneNumber: data.phone_number,
      },
      error: null,
    };
  } catch (error:any) {
    return {
      success: false,
      userInfo: null,
      error: error.message,
    };
  }
};

export { signUp, signIn};