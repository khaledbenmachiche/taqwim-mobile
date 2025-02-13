import httpRequest from "./httpRequest";

const savePushTokenToBackend = async (token:string,userId:string) => {
    try {
        const data = httpRequest('/save-push-token',"POST",{toke:token,user_id:userId});
        console.log(data);
    } catch (error) {
        console.error('Error saving push token:', error);
    }
};

export default savePushTokenToBackend;