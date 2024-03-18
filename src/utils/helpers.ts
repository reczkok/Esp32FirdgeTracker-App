import type { AxiosResponse } from "axios";
import { saveToken, getToken } from "./cache";
import { SESSION_TOKEN } from "../constants/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (data: any) => {
  console.log(JSON.stringify(data));
};

export const parseSessionToken = (res: AxiosResponse) => {
  const setCookie = res.headers["set-cookie"];
  if (!setCookie?.[0]) return;
  const session = setCookie[0].split(";");
  if (!session[0]) return;
  const sessionToken = session[0].split("=")[1];
  return sessionToken;
};

export const parseAndStoreSessionToken = async (res: AxiosResponse) => {
  const sessionToken = parseSessionToken(res);
  log(`PARSED SESSION TOKEN: ${sessionToken}`);
  if (!sessionToken) return false;
  await saveToken(SESSION_TOKEN, sessionToken);
  return true;
};

export const getSessionToken = async () => {
  const sessionToken = await getToken(SESSION_TOKEN);
  return sessionToken;
};

export const clearSessionToken = async () => {
  await saveToken(SESSION_TOKEN, "");
};
