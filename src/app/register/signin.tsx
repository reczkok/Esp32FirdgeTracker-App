import { SignInForm } from "../../components/SignIn/SignInForm";
import { RegisterContainer } from "../../components/RegisterContainer";
import { Stack } from "expo-router";

export default function SignIn() {
  return (
    <>
      <Stack.Screen options={{ title: "sign in" }} />
      <RegisterContainer title="Sign in">
        <SignInForm />
      </RegisterContainer>
    </>
  );
}
