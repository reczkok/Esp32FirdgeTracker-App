import {Button, StyleSheet, Text, View} from "react-native";
import {router, Stack, useLocalSearchParams} from "expo-router";
import {LineChart, BarChart} from "react-native-gifted-charts";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getDeviceMeasurements} from "../../utils/requests";
import {CurveType} from "gifted-charts-core";
import {deleteDevice} from "../../utils/requests";
import {log} from "../../utils/helpers";


export default function DeviceDetails() {
    const { deviceId } = useLocalSearchParams<{deviceId: string}>();
    const { espName } = useLocalSearchParams<{espName: string}>();
    const { data } = useQuery({
        queryKey: ["device", deviceId],
        queryFn: () => getDeviceMeasurements(deviceId),
    });
    const barChartData = data?.measurements.map((measurement) => ({
        // check if the distance is greater than 15cm, if it is set frontColor: '#177AD5', otherwise set frontColor: '#FF0000'
        value: measurement.temp ? Number(measurement.temp) : 0,
        label : measurement.date ? measurement.date : "no date",
        topLabelComponent: () => (
            <Text style={{color: 'blue', fontSize: 18, marginBottom: 6}}>
                {measurement.temp ? measurement.temp + "°C" : "0°C"}
            </Text>
        ),
        frontColor: measurement.closedDoor ? Boolean(measurement.closedDoor) ? '#3486d2' : '#3a3030' : '#e14848',
    }));
    log(barChartData)
    barChartData?.sort((a, b) => {
        const dateA = new Date(a.label);
        const dateB = new Date(b.label);
        return dateA.getTime() - dateB.getTime();
    });

    const deleteDeviceScreen = (deviceId: string) => async () => {
        await deleteDevice(deviceId);
        router.replace("/(app)/");
    }

    return (
        <>
            <Stack.Screen options={{ title: "device details" }} />
            <View style={styles.container}>
                <Text style={styles.title}>Device Details</Text>
                <Text style={styles.subtitle}>{espName}</Text>
            </View>
            <Button title={"Delete Device"} onPress={deleteDeviceScreen(deviceId)}/>
            <BarChart
                data={barChartData}
                width={400}
                height={450}
                spacing={120}
                roundedTop
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
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
    title: {
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },
    chart: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});