import { View, Pressable, useColorScheme, StyleSheet } from "react-native";
import type { PressableProps } from "react-native";
import { forwardRef } from "react";
import { Text } from "../components/Themed";
import { Link } from "expo-router";
import Colors from "../constants/Colors";
import Logo from "../../assets/images/refrigerator.svg";

export function RegisterScreen() {
  const theme = useColorScheme() ?? "light";
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: Colors[theme].background,
      }}
    >
      <View style={styles.logoContainer}>
        <Logo width={320} height={320} />
      </View>
      <View style={styles.buttonsContainer}>
        <Link href="/register/signin" asChild>
          <LogInButton />
        </Link>
        <Link href="/register/signup" asChild>
          <SignUpButton />
        </Link>
      </View>
    </View>
  );
}

const LogInButton = forwardRef((props: PressableProps) => {
  return (
    <Pressable
      {...props}
      style={{
        ...styles.button,
        ...styles.buttonSignIn,
      }}
    >
      <Text
        style={{
          ...styles.buttonText,
          ...styles.buttonSignInText,
        }}
      >
        Log in
      </Text>
    </Pressable>
  );
});

const SignUpButton = forwardRef((props: PressableProps) => {
  return (
    <Pressable
      {...props}
      style={{
        ...styles.button,
        ...styles.buttonSignUp,
      }}
    >
      <Text
        style={{
          ...styles.buttonText,
          ...styles.buttonSignUpText,
        }}
      >
        Sign up
      </Text>
    </Pressable>
  );
});

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
