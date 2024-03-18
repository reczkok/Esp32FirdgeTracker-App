import { SignUpForm } from "../../components/SignUp/SignUpForm";
import { RegisterContainer } from "../../components/RegisterContainer";
import { Stack } from "expo-router";

export default function SignUp() {
  return (
    <>
      <Stack.Screen options={{ title: "sign up" }} />
      <RegisterContainer title="Sign up">
        <SignUpForm />
      </RegisterContainer>
    </>
  );
}
