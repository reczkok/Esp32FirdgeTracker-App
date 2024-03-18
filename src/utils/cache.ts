import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { log } from "./helpers";

export async function saveToken(key: string, value: string) {
  log(`SAVING TOKEN: ${value}`);
  await SecureStore.setItemAsync(key, value);
}

export async function getToken(key: string) {
  const value = await SecureStore.getItemAsync(key);
  return value;
}
export const tokenCache =
  Platform.OS !== "web"
    ? {
        saveToken,
        getToken,
      }
    : undefined;
