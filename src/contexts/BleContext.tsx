import {Device} from "react-native-ble-plx";
import {createContext, useContext} from "react";
import {useQuery} from "@tanstack/react-query";

type BleContextType = {
    connectedDeviceContext: Device | undefined;
    isScanningContext: boolean;
}

export const BleContext = createContext<BleContextType | undefined>({
    connectedDeviceContext: undefined,
    isScanningContext: false,
});

export const useBleContext = () => useContext(BleContext);