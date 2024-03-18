import { URL } from "../constants/constants";
import axios from "axios";
import {clearSessionToken, getSessionToken, log} from "./helpers";

type RegisterRes = {
  registered: boolean;
};

export const registerRequest = async (data: {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;

}) => {
  log("REGISTER REQUEST");
  const res = await axios.post<RegisterRes>(`${URL}/processRegistrationForm`, {
    ...data,
  }, {
    withCredentials: true,
  });
  log("REGISTER RESPONSE");

  return res;
};

type LoginRes = {
  loggedIn: boolean;
  sessionStartTime: string;
  sessionDuration: string;
};

export const loginRequest = async (data: {
  username: string;
  password: string;
}) => {
  // instead of using body to send data, we can use params
    const res = await axios.post<LoginRes>(`${URL}/authenticateTheUser`, null, {
      params: {
        ...data,
      },
      withCredentials: true,
    });
  // const res = await axios.post<LoginRes>(`${URL}/authenticateTheUser`, {
  //   ...data,
  // });
  log("LOGIN REQUEST");
  log(res);
  return res;
};

type SessionRes = {
  userId: number;
  startTime: string;
  sessionEnd: string;
  username: string;
};

export const sessionRequest = async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return null;

  log(`CALLING SESSION WITH TOKEN: ${sessionToken}`);

  const res = await axios.get<SessionRes>(`${URL}/session`, {
    headers: {
      Cookie: `${sessionToken}`,
    },
    withCredentials: true,
  }).catch((err) => {
    log("SESSION REJECTED")
    clearSessionToken();
    return null;
  });
  if (!res) return null;
  if(res.status === 401) {
    await clearSessionToken();
    return null;
  }

  log("SESSION RESPONSE");
  log(res.data);

  return res.data;
};

type DeviceRes = {
  deviceId: string;
};

export const addDeviceRequest = async ({ name, id }: { name: string, id: string }) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return;

  log(`CALLING ADD DEVICE WITH TOKEN: ${sessionToken}`);

  const res = await axios.post<DeviceRes>(
    `${URL}/addDevice/${id}`,
    {
      info: name,
    },
    {
      headers: {
        Cookie: `${sessionToken}`,
      },
      withCredentials: true,
    }
  );
  return res.data;
};

export const sendNetworkDataToDevice = async ({
  data,
}: {
  data: string;
}) => {
  const url = "http://192.168.4.1:2152";
  const res = await axios.post(url, data);

  log(res.data);

  return res;
}

type DeviceMeasurementsRes = {
    measurements: {
        id: string;
        temp: string|null;
        closedDoor: boolean;
        date: string|null;
    }[];
}

export const getDeviceMeasurements = async (id : string) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return null;

  log(`CALLING DEVICE MEASUREMENTS WITH TOKEN: ${sessionToken}`);

  const res = await axios.get<DeviceMeasurementsRes>(
    `${URL}/deviceHistory/${id}`,
    {
      headers: {
        Cookie: `${sessionToken}`,
      },
      withCredentials: true,
    }
  );
  let artificialRes = res.data as unknown as { id: string; temp: string|null; closedDoor: boolean; date: string|null }[];
    res.data.measurements = artificialRes;
    log(res.data)
  return res.data;
};

type DeleteDeviceRes = {
    deleted: boolean;
};

export const deleteDevice = async (id : string) => {
    const sessionToken = await getSessionToken();
    if (!sessionToken) return null;

    log(`CALLING DELETE DEVICE WITH TOKEN: ${sessionToken}`);

    const res = await axios.delete<DeleteDeviceRes>(
        `${URL}/deleteDevice/${id}`,
        {
        headers: {
            Cookie: `${sessionToken}`,
        },
        withCredentials: true,
        }
    );
    return res.data;
}

type DevicesRes = {
  devices: {
    id: string;
    deviceName: string;
  }[];
};

export const getDevices = async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return null;

  log("GET DEVICES");
  log(`CALLING DEVICES WITH TOKEN: ${sessionToken}`);

  const res = await axios.get<DevicesRes>(`${URL}/devices`, {
    headers: {
      Cookie: `${sessionToken}`,
    },
  });

  let artificialRes = res.data as unknown as { id: string; deviceName: string }[];
  res.data.devices = artificialRes;
  return res.data;
};

export const signOutRequest = async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return null;

  await axios.post(`${URL}/logout`, {
    headers: {
      Cookie: `sessionToken=${sessionToken}`,
    },
  });
};
