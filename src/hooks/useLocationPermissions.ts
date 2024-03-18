import { useEffect, useState } from "react";
import {
  getBackgroundPermissionsAsync,
  getForegroundPermissionsAsync,
  requestBackgroundPermissionsAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { log } from "../utils/helpers";

export const useLocationPermissions = () => {
  const [
    isLocationPermissionFullyGranted,
    setIsLocationPermissionFullyGranted,
  ] = useState(false);
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] =
    useState(false);

  useEffect(() => {
    log({ isLocationPermissionGranted, isLocationPermissionFullyGranted });
  }, [isLocationPermissionFullyGranted, isLocationPermissionGranted]);

  const checkIfLocationIsFullyGranted = async () => {
    // Background permissions cannot be granted without foreground permissions
    const background = await getBackgroundPermissionsAsync();
    if (background.granted) {
      setIsLocationPermissionFullyGranted(true);
      return;
    }

    setIsLocationPermissionFullyGranted(false);
  };

  const checkIfLocationIsGranted = async () => {
    const foreground = await getForegroundPermissionsAsync();

    if (foreground.granted) {
      setIsLocationPermissionGranted(true);
      return;
    }

    setIsLocationPermissionGranted(false);
  };

  const askForLocationPermissions = async () => {
    const { granted } = await requestForegroundPermissionsAsync();
    if (!granted) return;
    const response = await requestBackgroundPermissionsAsync();
    setIsLocationPermissionGranted(true);
    if (response.granted) {
      setIsLocationPermissionFullyGranted(true);
    }
  };

  useEffect(() => {
    checkIfLocationIsGranted().catch(log);
    checkIfLocationIsFullyGranted().catch(log);
  }, []);

  return {
    isLocationPermissionFullyGranted,
    checkIfLocationIsFullyGranted,
    askForLocationPermissions,
    isLocationPermissionGranted,
  };
};
