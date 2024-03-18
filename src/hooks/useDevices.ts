import { useQuery } from "@tanstack/react-query";
import { getDevices } from "../utils/requests";
import { log } from "../utils/helpers";
import { useEffect } from "react";

export const useDevices = () => {
    const props = useQuery({
        queryKey: ["devices"],
        queryFn: getDevices,
    });

    useEffect(() => {
        log({ error: props.error?.message });
    }, [props.error]);

    return props;
};