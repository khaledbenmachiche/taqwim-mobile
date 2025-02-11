import Constants from "expo-constants";

const shareCalendarWithServiceAccount = async (accessToken: string, calendarId: string) => {
    try {
        const serviceEmailAccount = Constants.manifest.extra.serviceEmailAccount;
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/acl`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: 'reader',
                    scope: {
                        type: 'user',
                        value:  serviceEmailAccount
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Calendar sharing failed: ${response.status} - ${errorBody}`);
        }

        return true;
    } catch (error:any) {
        throw new Error(`Calendar sharing error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
};
export default shareCalendarWithServiceAccount;