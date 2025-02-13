import * as SecureStore from "expo-secure-store";

interface User {
    id: string|undefined|null;
    email: string|undefined|null;
    username: string|undefined|null;
    firstName: string|undefined|null;
    lastName: string|undefined|null;
    phoneNumber: string|undefined|null;
}
const getLoggedInUser = async () =>{
    const user:User = {
        id: undefined,
        username: undefined,
        email: undefined,
        firstName: undefined,
        phoneNumber: undefined,
        lastName: undefined
    };
    user.id = await SecureStore.getItemAsync('userId');
    if (user.id) {
        throw Error(`Not logged in`);
    }
    user.username = await SecureStore.getItemAsync('userUsername');
    user.email = await SecureStore.getItemAsync('userEmail');
    user.lastName = await SecureStore.getItemAsync('userLastName');
    user.firstName = await SecureStore.getItemAsync('userFirstName');
    user.phoneNumber = await SecureStore.getItemAsync('userPhoneNumber');
    return user;
}

export default getLoggedInUser;
export {User};