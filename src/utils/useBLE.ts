/* eslint-disable no-bitwise */
import {useContext, useMemo, useState} from "react";
import { PermissionsAndroid, Platform } from "react-native";
import {
  Base64,
  BleError,
  BleManager,
  Characteristic,
  Device,
} from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";
import {useBleContext} from "../contexts/BleContext";
import base64 from "react-native-base64";
// import buffer for base64 encoding
import { Buffer } from 'buffer';
import {log} from "./helpers";

const HEART_RATE_UUID = "0000180d-0000-1000-8000-00805f9b34fb";
const HEART_RATE_CHARACTERISTIC = "00002a37-0000-1000-8000-00805f9b34fb";
const ESP_UUID = "000000FF-0000-1000-8000-00805f9b34fb"
const ESP_MAC_CHARACTERISTIC = "0000FF01-0000-1000-8000-00805f9b34fb"
const ESP_WIFI_SSID_CHARACTERISTIC = "0000FF02-0000-1000-8000-00805f9b34fb"
const ESP_WIFI_PASSWORD_CHARACTERISTIC = "0000FF03-0000-1000-8000-00805f9b34fb"

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (id: string) => Promise<Device|null>;
  disconnectFromDevice: () => void;
  disconnectFromDeviceDirect: (device:Device) => Promise<void>;
  connectedDevice: Device | null;
  allDevices: Device[];
  getEspMac: () => Promise<Characteristic | null>;
  getEspMacDirect: (device: Device) => Promise<Characteristic | null>;
  getEspMacDirectDecoded: (device: Device) => Promise<string | null>;
  sendWifiCredentialsDirect: (device: Device, ssid: string, password: string) => Promise<void>;
  sendWifiCredentials: (ssid: string, password: string) => Promise<void>;
  isScanning: boolean;
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN!,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT!,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION!,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION!,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    if (isScanning) {
      return;
    }
    setIsScanning(true);
    bleManager.startDeviceScan([ESP_UUID, ESP_UUID], null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  }

  const connectToDevice = async (id: string) => {
    try {
      log("TRYING TO CONNECT TO DEVICE with id: " + id);
      const deviceConnection = await bleManager.connectToDevice(id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      log("CONNECTED TO DEVICE");
      //let mac = await getEspMacDirect(deviceConnection);
      //await sendWifiCredentialsDirect(deviceConnection, "402yes", "H@rn@sKrolGor");
      //log(deviceConnection);
      //log(deviceConnection.serviceUUIDs);
      setIsScanning(false);
      //startStreamingData(deviceConnection);
      return deviceConnection;
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
      setIsScanning(false);

      return null;
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
    }
  };

    const disconnectFromDeviceDirect = async (device: Device) => {
        if (device) {
          log("TRYING TO DISCONNECT FROM DEVICE with id: " + device.id);
         let disconnected = await bleManager.cancelDeviceConnection(device.id);
            log("DISCONNECTED FROM DEVICE");
         setConnectedDevice(null);
        }
    };

  // const startStreamingData = async (device: Device) => {
  //   if (device) {
  //     const espMac = await getEspMac(device)
  //     log(espMac?.value)
  //     await sendWifiCredentials(device, "402yes", "H@rn@sKrolGor")
  //   } else {
  //     console.log("No Device Connected");
  //   }
  // };

  const getEspMacDirect = async (device: Device) => {
    const mac = await device.readCharacteristicForService(ESP_UUID, ESP_MAC_CHARACTERISTIC)
    log("getEspMacDirect read:")
    log(mac.value)
    return mac
  }

  const getEspMacDirectDecoded = async (device: Device) => {
    const mac = await device.readCharacteristicForService(ESP_UUID, ESP_MAC_CHARACTERISTIC)
    if(mac.value){
        let converted = base64.decode(mac.value)
        converted = Buffer.from(mac.value, 'base64').toString('hex')
        converted = converted.toUpperCase().replace(/(.{2})/g, '$1:').slice(0, -1)
        log(converted)
        return converted
    }
    else{
      return null
    }
  }

  const getEspMac = async () => {
    if (connectedDevice) {
      const mac = await connectedDevice.readCharacteristicForService(ESP_UUID, ESP_MAC_CHARACTERISTIC)
      //log(mac)
      return mac
    } else {
      console.log("No Device Connected");
      return null
    }
  }

  const sendWifiCredentialsDirect = async (device: Device, ssid: string, password: string) => {
    const ssidBytes = base64.encode(ssid)
    const passwordBytes = base64.encode(password)
    const ssidCharacteristic = await device.writeCharacteristicWithoutResponseForService(ESP_UUID, ESP_WIFI_SSID_CHARACTERISTIC, ssidBytes)
    const passwordCharacteristic = await device.writeCharacteristicWithoutResponseForService(ESP_UUID, ESP_WIFI_PASSWORD_CHARACTERISTIC, passwordBytes)
    log("sendWifiCredentialsDirect write:")
    log(ssidCharacteristic.value)
    log(passwordCharacteristic.value)
  }

  const sendWifiCredentials = async (ssid: string, password: string) => {
    if (connectedDevice) {
      const ssidBytes = base64.encode(ssid)
      const passwordBytes = base64.encode(password)
      const ssidCharacteristic = await connectedDevice.writeCharacteristicWithoutResponseForService(ESP_UUID, ESP_WIFI_SSID_CHARACTERISTIC, ssidBytes)
      const passwordCharacteristic = await connectedDevice.writeCharacteristicWithoutResponseForService(ESP_UUID, ESP_WIFI_PASSWORD_CHARACTERISTIC, passwordBytes)
      log(ssidCharacteristic)
      log(passwordCharacteristic)
    } else {
      console.log("No Device Connected");
    }
  }

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    getEspMac,
    sendWifiCredentials,
    isScanning,
    getEspMacDirect,
    sendWifiCredentialsDirect,
    disconnectFromDeviceDirect,
    getEspMacDirectDecoded
  };
}

export default useBLE;
