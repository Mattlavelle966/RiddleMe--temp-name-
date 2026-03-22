import { Redirect } from "expo-router";
import { Platform } from "react-native";
import { getToken } from "../store/auth";
import { getBaseUrl, setBaseUrl } from "../store/connection";

export default function Index() {
  const token = getToken();
  let base = getBaseUrl();

  // DEV: always force connect screen
  if (__DEV__) {
    return <Redirect href="/connect" />;
  }

  // PROD web: auto use current origin
  if (Platform.OS === "web" && !base) {
    setBaseUrl(window.location.origin);
    base = window.location.origin;
  }

  // if still no backend → connect
  if (!base) return <Redirect href="/connect" />;

  // no auth → login
  if (!token) return <Redirect href="/login" />;

  // good → home
  return <Redirect href="/home" />;
}
