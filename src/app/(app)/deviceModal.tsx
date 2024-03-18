// import {Redirect, Stack} from "expo-router";
// import {AddDeviceScreen} from "../../screens/addDeviceScreen";
// import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
// import useBLE from "../../utils/useBLE";
//
// export default function DeviceModal() {
//     const { connectedDevice, isScanning } = useBLE();
//
//     if (!connectedDevice && !isScanning) {
//         return <Redirect href="/(app)/" />;
//     }
//
//     return (
//         <>
//             <Stack.Screen options={{ presentation: "modal", title: "add device" }} />
//             <AddDeviceScreen />
//         </>
//     );
// }
