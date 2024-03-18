import { View, Pressable, useColorScheme, StyleSheet } from "react-native";
import type { PressableProps } from "react-native";
import { forwardRef } from "react";
import { Text } from "../components/Themed";
import { Link } from "expo-router";
import Colors from "../constants/Colors";
import {DeviceAddContainer} from "../components/DeviceAddContainer";
import {AddDeviceForm} from "../components/DeviceAdd/AddDeviceForm";

export function AddDeviceScreen({id}: {id: string}) {
  const theme = useColorScheme() ?? "light";
  return (
    <DeviceAddContainer title={"Add Device"}>
        <AddDeviceForm id={id}/>
    </DeviceAddContainer>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
    },
    logoContainer: {
        width: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonsContainer: {
        width: "100%",
        backgroundColor: "green",
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    button: {
        width: "100%",
        height: 82,

        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    buttonSignIn: {
        backgroundColor: "#F5F5F5",
    },
    buttonSignInText: {
        color: "#191919",
    },
    buttonSignUp: {
        backgroundColor: "#191919",
    },
    buttonSignUpText: {
        color: "#F5F5F5",
    },
});