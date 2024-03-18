import { View, Text, TextInput } from "../Themed";
import { StyleSheet, Platform } from "react-native";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { ErrorText } from "../Themed";
import { useAuth } from "../../contexts/AuthContext";
import { PasswordInput } from "../PasswordInput";
import { ActionButton } from "../Buttons/ActionButton";
import { ActivityIndicatorBox } from "../ActivityIndicatorBox";

type FormData = {
    userName: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    confirm: string;
};

const errorMessages = {
    userName: {
        required: "Username is required",
        maxLength: "Username cannot exceed 16 characters",
        minLength: "Username must be at least 3 characters",
        pattern: "Username must contain only letters, numbers and underscores",
    },
    password: {
        required: "Password is required",
        maxLength: "Password cannot exceed 50 characters",
        minLength: "Password must be at least 8 characters",
        pattern:
            "Password must contain at least one uppercase letter, one lowercase letter and one number",
    },
    confirm: {
        validate: "Passwords must match",
    },
    firstName: {
        required: "First name is required",
        maxLength: "First name cannot exceed 50 characters",
        minLength: "First name must be at least 2 characters",
        pattern: "First name must contain only letters",
    },
    lastName: {
        required: "Last name is required",
        maxLength: "Last name cannot exceed 50 characters",
        minLength: "Last name must be at least 2 characters",
        pattern: "Last name must contain only letters",
    },
    email: {
        required: "Email is required",
        pattern: "Email must be valid",
    }
};

export const SignUpForm = () => {
    const { signUp, isSignUpPending } = useAuth();
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormData>();

    const onSubmit = ({ userName, password, firstName, lastName, email }: FormData) => {
        signUp({
            userName,
            password,
            firstName,
            lastName,
            email,
        });
        reset();
    };

    return (
        <View>
            <Controller
                control={control}
                rules={{
                    required: true,
                    maxLength: 16,
                    minLength: 3,
                    pattern: /^[a-zA-Z0-9_]{3,16}$/,
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
                name="userName"
            />
            <View style={styles.errorsView}>
                {errors.userName?.type === "required" && (
                    <ErrorText>{errorMessages.userName.required}</ErrorText>
                )}
                {errors.userName?.type === "maxLength" && (
                    <ErrorText>{errorMessages.userName.maxLength}</ErrorText>
                )}
                {errors.userName?.type === "minLength" && (
                    <ErrorText>{errorMessages.userName.minLength}</ErrorText>
                )}
                {errors.userName?.type === "pattern" && (
                    <ErrorText>{errorMessages.userName.pattern}</ErrorText>
                )}
            </View>
            <Controller
                control={control}
                rules={{
                    required: true,
                    maxLength: 50,
                    minLength: 2,
                    pattern: /^[a-zA-Z]+$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="First Name"
                        style={styles.input}
                    />
                )}
                name="firstName"
            />
            <View style={styles.errorsView}>
                {errors.firstName?.type === "required" && (
                    <ErrorText>{errorMessages.firstName.required}</ErrorText>
                )}
                {errors.firstName?.type === "maxLength" && (
                    <ErrorText>{errorMessages.firstName.maxLength}</ErrorText>
                )}
                {errors.firstName?.type === "minLength" && (
                    <ErrorText>{errorMessages.firstName.minLength}</ErrorText>
                )}
                {errors.firstName?.type === "pattern" && (
                    <ErrorText>{errorMessages.firstName.pattern}</ErrorText>
                )}
            </View>
            <Controller
                control={control}
                rules={{
                    required: true,
                    maxLength: 50,
                    minLength: 2,
                    pattern: /^[a-zA-Z]+$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Last Name"
                        style={styles.input}
                    />
                )}
                name="lastName"
            />
            <View style={styles.errorsView}>
                {errors.lastName?.type === "required" && (
                    <ErrorText>{errorMessages.lastName.required}</ErrorText>
                )}
                {errors.lastName?.type === "maxLength" && (
                    <ErrorText>{errorMessages.lastName.maxLength}</ErrorText>
                )}
                {errors.lastName?.type === "minLength" && (
                    <ErrorText>{errorMessages.lastName.minLength}</ErrorText>
                )}
                {errors.lastName?.type === "pattern" && (
                    <ErrorText>{errorMessages.lastName.pattern}</ErrorText>
                )}
            </View>
            <Controller
                control={control}
                rules={{
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Email"
                        style={styles.input}
                    />
                )}
                name="email"
            />
            <View style={styles.errorsView}>
                {errors.email?.type === "required" && (
                    <ErrorText>{errorMessages.email.required}</ErrorText>
                )}
                {errors.email?.type === "pattern" && (
                    <ErrorText>{errorMessages.email.pattern}</ErrorText>
                )}
            </View>
            <Controller
                control={control}
                rules={{
                    required: true,
                    maxLength: 50,
                    minLength: 8,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/,
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
                {errors.password?.type === "maxLength" && (
                    <ErrorText>{errorMessages.password.maxLength}</ErrorText>
                )}
                {errors.password?.type === "minLength" && (
                    <ErrorText>{errorMessages.password.minLength}</ErrorText>
                )}
                {errors.password?.type === "pattern" && (
                    <ErrorText>{errorMessages.password.pattern}</ErrorText>
                )}
            </View>
            <Controller
                control={control}
                rules={{ validate: (value) => value === watch("password") }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Confirm password"
                        style={styles.input}
                    />
                )}
                name="confirm"
            />
            <View style={styles.errorsView}>
                {errors.confirm?.type === "validate" && (
                    <ErrorText>{errorMessages.confirm.validate}</ErrorText>
                )}
            </View>
            <ActivityIndicatorBox isActive={isSignUpPending} />
            <ActionButton style={styles.button} onPress={handleSubmit(onSubmit)}>
                Sign up
            </ActionButton>
            <Text style={styles.text}>
                Already have an account?{" "}
                <Link href={"/register/signin"} style={{ color: "#007AFF" }}>
                    Sign in
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
        minHeight: 20,
        width: "100%",
        whiteSpace: "pre-wrap",
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
