import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import {log} from "../../utils/helpers";
import useBLE from "../../utils/useBLE";

export default function AppLayout() {
  const { isSignedIn, isLoading } = useAuth();
  const { connectedDevice } = useBLE();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    log("redirecting to register");
    return <Redirect href="/register/" />;
  }

  if (connectedDevice) {
    return <Redirect href="/appAdder/" />;
  }

  return <Stack />;
}

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
