import { RegisterScreen } from "../../screens/registerScreen";
import {Redirect, router, Stack} from "expo-router";
import {useAuth} from "../../contexts/AuthContext";
import {getToken} from "../../utils/cache";
import { SESSION_TOKEN} from "../../constants/constants";
import {log} from "../../utils/helpers";
import {sessionRequest} from "../../utils/requests";

export default function Index() {

    const tokenChecker = async () => {
        log("checking token")
        let token = await getToken(SESSION_TOKEN);
        let session = await sessionRequest();
        log({token})
        if (token && session) {
            log("redirecting to app")
            router.replace("/(app)/");
        }
    }

    tokenChecker();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RegisterScreen />
    </>
  );
}
