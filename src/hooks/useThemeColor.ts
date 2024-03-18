import Colors from "../constants/Colors";
import { useColorScheme } from "react-native";

type ColorsLight = keyof typeof Colors.light;
type ColorsDark = keyof typeof Colors.dark;

export function useThemeColor(
  props: { light?: string; dark?: string },
  // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
  colorName: ColorsLight & ColorsDark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
