import {Controller, useForm} from "react-hook-form";
import {addDeviceRequest, sendNetworkDataToDevice} from "../../utils/requests";
import {log} from "../../utils/helpers";
import Toast from "react-native-root-toast";
// import {useMutation} from "@tanstack/react-query/build/modern/index";
// import {useDevices} from "../../hooks/useDevices";
// import {useLocationPermissions} from "../../hooks/useLocationPermissions";
import {ErrorText, Text, TextInput, View} from "../Themed";
import {PasswordInput} from "../PasswordInput";
import {ActivityIndicator, Platform, StyleSheet} from "react-native";
import {ActionButton} from "../Buttons/ActionButton";
import {StatusBar} from "expo-status-bar";
import {useTimeout} from "../../hooks/useTimeout";
import {useEffect, useState} from "react";
import useBLE from "../../utils/useBLE";
import {router} from "expo-router";

type FormData = {
    name: string;
    ssid: string;
    password: string;
}

const errorMessages = {
    name: {
        required: "device name is required",
    },
    ssid: {
        required: "SSID is required",
    },
    password: {
        required: "network password is required",
    },
};

export const AddDeviceForm = ({id} : {id: string}) => {
    //const { refetch: refetchUserDevices } = useDevices();
    // const { askForLocationPermissions } = useLocationPermissions();
    const { isActive, startActiveTimeout } = useTimeout();
    const [text, setText] = useState("");
    const [isLoading, setIsLodaing] = useState(false);
    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<FormData>();
    const {  sendWifiCredentialsDirect, getEspMacDirect, disconnectFromDeviceDirect, connectToDevice, getEspMacDirectDecoded } = useBLE();

    const addNewDevice = async (data: FormData) => {
        try {
            log("Adding new device");
            const { name, ssid, password } = data;
            // we need to process the id: replace all %3A with :
            const properId = id.replace(/%3A/g, ":");
            log(properId);
            let device = await connectToDevice(properId);
            if (!device) {
                log("No device");
                return;
            }

            let espMac = await getEspMacDirectDecoded(device);
            if (!espMac) {
                return;
            }
            let mac = espMac;
            log({ mac });
            if (!mac) {
                log("No mac address");
                return;
            }
            await sendWifiCredentialsDirect(device, ssid, password);

            const addDeviceRes = await addDeviceRequest({ name: name, id: mac });

            Toast.show("Successfully added new device", {
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
            });

            //await refetchUserDevices();

            //await disconnectFromDeviceDirect(device);
            log({ addedDevice: addDeviceRes });
            router.replace("/(app)/");

            reset();
        } catch (e) {
            log(e);
            setText(JSON.stringify(e));
        } finally {
            setIsLodaing(false);
        }
    };

    // const { mutate: addDeviceMutation, isPending } = useMutation({
    //     mutationFn: addNewDevice,
    //     onSuccess: () => {
    //         startActiveTimeout();
    //     },
    //     onError: (err) => {
    //         log("ERROR");
    //         log(err.message);
    //     },
    // });

    const onSubmit = (data: FormData) => {
        addNewDevice(data);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Device</Text>
            <Controller
                control={control}
                rules={{
                    required: true,
                    maxLength: 16,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Device name"
                        style={styles.input}
                    />
                )}
                name="name"
            />
            <View style={styles.errorsView}>
                {errors.name?.type === "required" && (
                    <ErrorText>{errorMessages.name.required}</ErrorText>
                )}
            </View>

            <Controller
                control={control}
                rules={{
                    required: true,
                    maxLength: 16,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Network SSID"
                        style={styles.input}
                    />
                )}
                name="ssid"
            />

            <View style={styles.errorsView}>
                {errors.ssid?.type === "required" && (
                    <ErrorText>{errorMessages.ssid.required}</ErrorText>
                )}
            </View>

            <Controller
                control={control}
                rules={{
                    required: true,
                    maxLength: 16,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Network password"
                        style={styles.input}
                    />
                )}
                name="password"
            />

            <View style={styles.errorsView}>
                {errors.password?.type === "required" && (
                    <ErrorText>{errorMessages.password.required}</ErrorText>
                )}
            </View>

            {/*<View style={styles.activityIndicatorContainer}>*/}
            {/*    {isPending && <ActivityIndicator />}*/}
            {/*</View>*/}
            <ActionButton style={styles.button} onPress={handleSubmit(onSubmit)}>
                Submit
            </ActionButton>

            {/*{isActive && (*/}
            {/*    <View style={styles.successMessageContainer}>*/}
            {/*        <Text style={styles.successMessage}>*/}
            {/*            Successfully added new device*/}
            {/*        </Text>*/}
            {/*    </View>*/}
            {/*)}*/}

            {/*<View style={styles.activityIndicatorContainer}>*/}
            {/*    {isLoading && <ActivityIndicator />}*/}
            {/*</View>*/}

            <Text>{text}</Text>

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    )
}

const styles = StyleSheet.create({
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