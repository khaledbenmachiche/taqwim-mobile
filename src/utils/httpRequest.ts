import Constants  from "expo-constants";

const apiBaseUrl = Constants.manifest.extra.apiBaseUrl;
const httpRequest = async (endpoint: string, method: string = "GET", body?: object) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${apiBaseUrl}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `Error ${response.status}`);
    }

    return responseData;
  } catch (error: any) {
    throw new Error(error?.message || "Network request failed");
  }
};

export default httpRequest;