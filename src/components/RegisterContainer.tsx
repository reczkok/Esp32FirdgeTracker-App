import { StyleSheet } from "react-native";
import { SafeAreaView, Text, View } from "../components/Themed";

export const RegisterContainer = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.component}>
        <Text style={styles.title}>{title}</Text>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  component: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "90%",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
});
