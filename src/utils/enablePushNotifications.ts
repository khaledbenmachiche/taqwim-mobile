import savePushTokenToBackend from "./savePushTokenToBackend";
import registerForPushNotificationsAsync from "./registerForPushNotificationsAsync";
import getLoggedInUser from "./getLoggedInUser";

const handleEnableNotifications = async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
        const user = await getLoggedInUser();
        if (user && user.id) {
            await savePushTokenToBackend(token, user.id);
        }
    }
};
export default handleEnableNotifications;