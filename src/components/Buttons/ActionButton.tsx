import { StyleSheet } from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";
import { Text, TouchableOpacity } from "../Themed";
import type { TouchableOpacityProps } from "../Themed";

type Props = TouchableOpacityProps & { children: string };

export const ActionButton = ({ children, ...other }: Props) => {
  const color = useThemeColor({}, "buttonText");
  return (
    <TouchableOpacity {...other}>
      <Text style={{ color, ...style.text }}>{children}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
