/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PermissionsAndroid, Platform } from "react-native";
import * as BackgroundFetch from 'expo-background-fetch';
import {
  registerRequest,
  loginRequest,
  sessionRequest, getDevices, getDeviceMeasurements,
} from "../utils/requests";
import {
  log,
  parseAndStoreSessionToken,
  clearSessionToken,
} from "../utils/helpers";
import { router } from "expo-router";
import Toast from "react-native-root-toast";
import { signOutRequest } from "../utils/requests";
// import * as Notifications from "expo-notifications";
// import * as TaskManager from "expo-task-manager";
// import {getToken} from "../utils/cache";
// import {SESSION_TOKEN} from "../constants/constants";
// import * as Device from "expo-device";

//const BACKGROUND_FETCH_TASK = 'background-fetch';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });
//
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//   // try to get user session token, if it exists, then fetch all devices using the token
//   // for each device, fetch the latest measurement
//   const token = await getToken(SESSION_TOKEN);
//   const session = await sessionRequest();
//   log("Attempting to fetch devices")
//   if (token && session) {
//     log("Fetching devices")
//     const devices = await getDevices();
//     const allDevices = devices?.devices;
//     if (devices && allDevices) {
//       for (let i = 0; i < allDevices.length; i++) {
//         const measurements = await getDeviceMeasurements(allDevices[i]!.id);
//         const sortedByDate = measurements?.measurements.sort((a, b) => {
//           const dateA = new Date(a.date!);
//           const dateB = new Date(b.date!);
//           return dateA.getTime() - dateB.getTime();
//         });
//         const latestMeasurement = sortedByDate?.[sortedByDate.length - 1];
//         if (latestMeasurement) {
//           const tempAsNumber = Number(latestMeasurement.temp);
//           if (tempAsNumber > 30) {
//             await schedulePushNotification(allDevices[i]!.deviceName!);
//           }else {
//             log("Temperature is not dangerous")
//           }
//         }
//       }
//     }
//   }
// });

type AuthContextType = {
  isSignedIn: boolean;
  signUp: ({
    userName,
    password,
    firstName,
    lastName,
    email,
  }: {
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
  signIn: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  signOut: () => Promise<void>;
  isSignUpPending: boolean;
  isSignInPending: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  signIn: () => {},
  signUp: () => {},
  signOut: () => new Promise((res) => res()),
  isSignInPending: false,
  isSignUpPending: false,
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: sessionData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["sessionToken"],
    queryFn: sessionRequest,
    retry: false,
  });

  useEffect(() => {
    log({ sessionData });
  });

  const signOut = async () => {
    await clearSessionToken();
    router.replace("/register/");
    await signOutRequest();
    // await unregisterBackgroundFetchAsync();
    await refetch();
  };

  const { mutate: signUpMutation, isPending: isSignUpPending } = useMutation({
    mutationFn: registerRequest,
    onSuccess: (res) => {
      const data = res.data;
      log({ data });
      router.replace("/register/signin");
      Toast.show("Account created. Please sign in.");
    },
    onError: (err) => {
      log("SIGN UP ERROR");
      log(err.message);
      Toast.show(err.message);
    },
  });

  const { mutate: signInMutation, isPending: isSignInPending } = useMutation({
    mutationFn: loginRequest,
    onSuccess: async (res) => {
      // get cookies to store session token

      log({ res });
      if (res.status !== 200) {
        Toast.show("Failed to sign in");
        return;
      }
      await parseAndStoreSessionToken(res);
      await refetch();
      // await registerForPushNotificationsAsync()
      // await registerBackgroundFetchAsync();
      Toast.show("Signed in");
      router.replace("/(app)/");
    },
    onError: (err) => {
      log("SIGN IN ERROR");
      log(err.message);
      Toast.show(err.message);
    },
  });

  const signUp = ({
    userName,
    password,
      firstName,
        lastName,
      email,
  }: {
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    signUpMutation({ userName, password, firstName, lastName, email });
  };

  const signIn = ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    signInMutation({ username, password });
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        isSignInPending,
        isSignUpPending,
        isSignedIn: sessionData ? true : false,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// async function registerBackgroundFetchAsync() {
//   return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//     minimumInterval: 60 * 15, // 15 minutes
//     stopOnTerminate: false, // android only,
//     startOnBoot: true, // android only
//   });
// }
//
// async function unregisterBackgroundFetchAsync() {
//   return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
// }
//
// async function schedulePushNotification(name: string) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Dangerous temperature detected!",
//       body: `Device ${name} has detected a temperature above 30°C`,
//       data: { data: 'dangerous' },
//     },
//     trigger: { seconds: 2 },
//   });
// }
//
// async function registerForPushNotificationsAsync() {
//   let token;
//
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }
//
//   if (Device.isDevice) {
//     const {status: existingStatus} = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const {status} = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     // Learn more about projectId:
//     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//     token = (await Notifications.getExpoPushTokenAsync({projectId: 'your-project-id'})).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }
//
//   return token;
// }