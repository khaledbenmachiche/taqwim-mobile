import Constants  from "expo-constants";

const apiBaseUrl = Constants.manifest.extra.apiBaseUrl;

const httpRequest = async (endpoint:string, method:string, body:object) => {
  try {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Request failed');
    }

    return responseData;
  } catch (error: any) {
    throw new Error(error.message || 'Network request failed');
  }
};

export default httpRequest;