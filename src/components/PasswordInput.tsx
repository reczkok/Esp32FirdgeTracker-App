import { forwardRef, useState } from "react";
import { TextInput } from "./Themed";
import type { TextInputProps } from "./Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import type { TextInput as DefaultTextInput, TextStyle } from "react-native";
import { useColorScheme } from "react-native";

export const PasswordInput = forwardRef<DefaultTextInput, TextInputProps>(
  (props, ref) => {
    const { style, ...otherProps } = props;
    const theme = useColorScheme() ?? "light";

    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const styleWithPadding = {
      ...(style as TextStyle),
      paddingRight: 40,
    } as typeof style;

    return (
      <View>
        <TextInput
          {...otherProps}
          style={styleWithPadding}
          ref={ref}
          secureTextEntry={!showPassword}
        />
        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color={theme === "light" ? "black" : "white"}
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
          }}
          onPress={toggleShowPassword}
        />
      </View>
    );
  }
);
