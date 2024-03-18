import { StyleSheet, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "../../components/Themed";
import { useDevices }from "../../hooks/useDevices";
import { log } from "../../utils/helpers";
import { FlashList } from "@shopify/flash-list";
import { Box } from "../../components/Box";
import { Octicons } from "@expo/vector-icons";
import {router, Stack} from "expo-router";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import {ActionButton} from "../../components/Buttons/ActionButton";
import useBLE from "../../utils/useBLE";

const DATA = [
  {
    title: "First Item",
  },
  {
    title: "Second Item",
  },
];

export default function Index() {
  const { signOut } = useAuth();
  const { data } = useDevices();
  const colorScheme = useColorScheme();

  log("user data");
  log({ userDevices: data });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Devices",
          headerRight: () => (
            <Link href="/(app)/modal" asChild>
              <Pressable style={{ marginRight: 10 }}>
                {({ pressed }) => (
                  <AntDesign
                    name="pluscircleo"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{
                      marginRight: 20,
                      opacity: pressed ? 0.5 : 1,
                    }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerLeft: () => (
            <Pressable onPress={signOut} style={{ marginRight: 10 }}>
              {({ pressed }) => (
                <Feather
                  name="log-out"
                  size={25}
                  color={Colors[colorScheme ?? "light"].text}
                  style={{
                    marginRight: 20,
                    opacity: pressed ? 0.5 : 1,
                  }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        {<ActionButton onPress={signOut}>Sign out</ActionButton>}
        <View style={styles.listContainer}>
          <FlashList
            data={data?.devices}
            renderItem={({ item }) => <ListItem text={item.deviceName} id={item.id} />}
            estimatedItemSize={200}
            horizontal={false}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

function ListItem({ text, id }: { text: string, id: string}) {
  return (
      <Pressable onPress={() => { router.push({ pathname: "/(app)/[deviceId]", params : {deviceId: id, espName: text}}) }}>
    <Box style={styles.item}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Octicons name="container" size={40} color="black" />
      </View>
      <View style={{ flex: 2, alignItems: "center" }}>
        <Text>{text}</Text>
        <Text>{id}</Text>
      </View>
    </Box>
        </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  listContainer: {
    width: "100%",
    flex: 1,
  },
  item: {
    height: 100,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
});
