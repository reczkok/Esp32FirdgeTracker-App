import type { ViewProps } from "./Themed";
import { View } from "./Themed";

type Props = ViewProps & {
  children: React.ReactElement[];
};

// Themed View
export const Box = ({ children, ...other }: Props) => {
  return <View {...other}>{children}</View>;
};
