import {
  Pressable,
  StyleSheet,
  Text, View,
  ViewStyle
} from "react-native";
import * as FeatherIcons from "react-native-feather";
import { useStyle } from "react-native-style-utilities";
import useColors from "../hooks/useColors";
import useHaptics from "../hooks/useHaptics";

export default function LinkButton({
  type = "primary",
  onPress,
  children,
  style = {},
  icon = null,
  testID,
  disabled,
}: {
  type?: "primary" | "secondary" | "danger";
  onPress: () => any;
  children?: React.ReactNode;
  style?: ViewStyle;
  icon?: keyof typeof FeatherIcons | null;
  testID?: string;
  disabled?: boolean;
}) {
  const colors = useColors();
  const haptics = useHaptics();

  const color = {
    primary: disabled
      ? colors.linkButtonTextPrimaryDisabled
      : colors.linkButtonTextPrimary,
    secondary: disabled
      ? colors.linkButtonTextSecondaryDisabled
      : colors.linkButtonTextSecondary,
    danger: disabled
      ? colors.linkButtonTextDangerDisabled
      : colors.linkButtonTextDanger,
  }[type];

  const Icon = FeatherIcons[icon as keyof typeof FeatherIcons];

  const textStyle = useStyle(() => [styles.text, { color }], [color]);

  const _onPress = () => {
    console.log("LinkButton: onPress");
    if (!disabled) {
      haptics.selection();
      onPress();
    }
  }


  return (
    <Pressable
      style={({ pressed }) => [{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        ...style,
      }]}
      onPress={_onPress}
      testID={testID}
    >
      {icon && (
        <View style={styles.iconContainer}>
          <Icon width={17} color={color} />
        </View>
      )}
      {children && (
        <Text ellipsizeMode="tail" numberOfLines={1} style={textStyle}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  text: {
    fontSize: 17,
    textAlign: "center",
  },
  iconContainer: { marginRight: 5 },
});
