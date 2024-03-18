import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {router, Stack} from "expo-router";
import { Platform, StyleSheet, ActivityIndicator } from "react-native";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ErrorText, SafeAreaView,
} from "../../components/Themed";
import useBLE from "../../utils/useBLE";
import {FlashList} from "@shopify/flash-list";
import {Box} from "../../components/Box";
import {Octicons} from "@expo/vector-icons";
import {Appearance} from "react-native";

type FormData = {
  name: string;
  ssid: string;
  password: string;
};

export default function ModalScreen() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    isScanning
  } = useBLE();

  const scanForDevices = async () => {
    if (connectedDevice) {
      return;
    }
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

    useEffect(() => {
      if (!isScanning && !connectedDevice) {
        scanForDevices();
      }
    }, []);

  return (
      // display the list of devices using allDevices array
      // display
    <>
      <Stack.Screen options={{ presentation: "modal", title: "" }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          <FlashList
              data={allDevices}
              renderItem={({ item }) => <ListItem text={item.name ? item.name : "noName"} id={item.id} />}
              estimatedItemSize={200}
              horizontal={false}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

function ListItem({ text, id }: { text: string, id: string}) {
  const { connectToDevice } = useBLE();
  const connectAndRedirect = async () => {
    router.push({
      pathname: "/appAdder/[id]",
      params : { id: id }
    })
  }

  return (
      <Box style={styles.item}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Octicons name="container" size={40} color="black" />
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text>{text}</Text>
          <Text>{id}</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <TouchableOpacity onPress={() => { connectAndRedirect() }}>
            <Text>Connect</Text>
          </TouchableOpacity>
        </View>
      </Box>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D7D7D7",
    marginTop: 20,
    width: "100%",
  },
  errorsView: {
    height: 30,
    justifyContent: "center",
  },
  activityIndicatorContainer: {
    height: 40,
    justifyContent: "center",
  },
  successMessageContainer: {
    marginTop: 10,
    width: "100%",
    backgroundColor: "#00F19830",
    paddingVertical: 5,
    borderRadius: 5,
  },
  successMessage: {
    color: "#00F198",
    textAlign: "center",
  },
  button: {
    marginTop: 30,
    borderRadius: 4,
    paddingVertical: 16,
    width: "100%",
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
