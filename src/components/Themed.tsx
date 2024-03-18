/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import {
  Text as DefaultText,
  View as DefaultView,
  SafeAreaView as DefaultSafeAreaView,
  TouchableOpacity as DefaultTouchableOpacity,
  TextInput as DefaultTextInput,
} from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

import { forwardRef } from "react";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type TextProps = ThemeProps & DefaultText["props"];
type ViewProps = ThemeProps & DefaultView["props"];
type SafeAreViewProps = ThemeProps & DefaultSafeAreaView["props"];
type TouchableOpacityProps = ThemeProps & DefaultTouchableOpacity["props"];
type TextInputProps = ThemeProps & DefaultTextInput["props"];

const Text = forwardRef<DefaultText, TextProps>((props, ref) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText ref={ref} style={[{ color }, style]} {...otherProps} />;
});

const TextInput = forwardRef<DefaultTextInput, TextInputProps>((props, ref) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textInputText"
  );

  return (
    <DefaultTextInput ref={ref} style={[{ color }, style]} {...otherProps} />
  );
});

const View = forwardRef<DefaultView, ViewProps>((props, ref) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "viewBackground"
  );

  return (
    <DefaultView
      ref={ref}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
});

const ErrorText = forwardRef<DefaultText, TextProps>((props, ref) => {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "errorText"
  );

  return <DefaultText ref={ref} style={[{ color }, style]} {...otherProps} />;
});

const SafeAreaView = forwardRef<DefaultSafeAreaView, SafeAreViewProps>(
  (props, ref) => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );

    return (
      <DefaultSafeAreaView
        ref={ref}
        style={[{ backgroundColor }, style]}
        {...otherProps}
      />
    );
  }
);

const TouchableOpacity = forwardRef<
  DefaultTouchableOpacity,
  TouchableOpacityProps
>(({ children, ...props }, ref) => {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor({}, "buttonBackground");

  return (
    <DefaultTouchableOpacity
      ref={ref}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    >
      {children}
    </DefaultTouchableOpacity>
  );
});

export type {
  TextProps,
  ViewProps,
  SafeAreViewProps,
  TouchableOpacityProps,
  TextInputProps,
};

export { Text, View, SafeAreaView, TouchableOpacity, TextInput, ErrorText };
