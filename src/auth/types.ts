interface User {
  id: string;
  username: string;
  email: string;
  lastName?:string;
  firstName?:string;
  phoneNumber?:string;
  
  photo?: string;
  idToken?: string;
  serverAuthCode?: string;
  accessToken?: string;
}

interface SignInData {
  username: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  username: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
}

interface SignInResult {
  success: boolean;
  userInfo: User | null;
  error: string | null;
}

type CalendarSharingResult = {
  success: boolean;
  error?: string;
};

export type { User, SignInResult,CalendarSharingResult,SignInData,SignUpData };