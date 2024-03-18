import { View, Text, TextInput, ErrorText } from "../Themed";
import { StyleSheet, Platform } from "react-native";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { PasswordInput } from "../PasswordInput";
import { ActionButton } from "../Buttons/ActionButton";
import { ActivityIndicatorBox } from "../ActivityIndicatorBox";

type FormData = {
  username: string;
  password: string;
};

const errorMessages = {
  username: {
    required: "Username is required",
  },
  password: {
    required: "Password is required",
  },
};

export const SignInForm = () => {
  const { signIn, isSignInPending } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
      // send the data as params to the server
    signIn(data);
    reset();
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: true,
          maxLength: 16,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Username"
            style={styles.input}
          />
        )}
        name="username"
      />

      <View style={styles.errorsView}>
        {errors.username?.type === "required" && (
          <ErrorText>{errorMessages.username.required}</ErrorText>
        )}
      </View>
      <Controller
        control={control}
        rules={{
          required: true,
          maxLength: 20,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            style={styles.input}
          />
        )}
        name="password"
      />
      <View style={styles.errorsView}>
        {errors.password?.type === "required" && (
          <ErrorText>{errorMessages.password.required}</ErrorText>
        )}
      </View>
      <ActivityIndicatorBox isActive={isSignInPending} />
      <ActionButton style={styles.button} onPress={handleSubmit(onSubmit)}>
        Sign in
      </ActionButton>
      <Text style={styles.text}>
        Don't have an account?{" "}
        <Link href={"/register/signup"} style={{ color: "#007AFF" }}>
          Sign up
        </Link>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 2,
    paddingVertical: 3,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#A7A7A7",
    marginTop: 20,
  },
  text: {
    marginTop: 20,
    textAlign: "center",
  },
  errorsView: {
    height: 20,
  },
  button: {
    marginTop: 30,
    borderRadius: 4,
    paddingVertical: 16,
    width: "100%",
    alignSelf: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
