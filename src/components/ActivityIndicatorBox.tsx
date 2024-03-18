import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native";

export const ActivityIndicatorBox = ({ isActive }: { isActive: boolean }) => {
  return (
    <View style={styles.container}>{isActive && <ActivityIndicator />}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
