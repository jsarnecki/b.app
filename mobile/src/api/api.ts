import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const getJson = async (route: string) => {
  const response = await fetch(`${API_URL}/${route}`, {
    method: 'GET',
    headers: await getHeaders(),
  });

  const data = await response.json();
  if (!response.ok) {
    let error = data.message || 'An unexpected error occurred.';

    if (data.error) {
      // Chain all error messages together. 
      error = Object.values(data.error).flat().join(', ');
    }
    throw new Error(error);
  }
  return data;
}

export const postJson = async (route: string, body: Record<string, unknown>) => {
  const response = await fetch(`${API_URL}/${route}`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    let error = data.message || 'An unexpected error occurred.';

    if (data.error) {
      // Chain all error messages together. 
      error = Object.values(data.error).flat().join(', ');
    }
    throw new Error(error);
  }
  return data;
}

