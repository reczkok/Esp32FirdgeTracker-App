import {Redirect, Stack} from "expo-router";
import {AddDeviceScreen} from "../../screens/addDeviceScreen";
import {useLocalSearchParams} from "expo-router";

import useBLE from "../../utils/useBLE";
import {AddDeviceForm} from "../../components/DeviceAdd/AddDeviceForm";

export default function DeviceAdder() {
    const { id } = useLocalSearchParams<{id: string}>();

    return (
        <>
            <Stack.Screen options={{ title: "add device" }} />
            <AddDeviceForm id={id} />
        </>
    );
}