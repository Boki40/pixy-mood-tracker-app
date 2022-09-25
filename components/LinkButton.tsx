import { Pressable, PressableProps, Text, TextProps, View } from "react-native";
import useColors from "../hooks/useColors";
import useHaptics from "../hooks/useHaptics";
import * as FeatherIcons from 'react-native-feather';

export default function LinkButton({ 
  type = 'primary', 
  onPress, 
  children, 
  style = {}, 
  textStyle = {},
  icon = null,
  testID,
  disabled,
}: {
  type?: 'primary' | 'secondary' | 'danger',
  onPress: () => any,
  children?: React.ReactNode,
  style?: PressableProps['style'],
  textStyle?: TextProps['style'],
  icon?: keyof typeof FeatherIcons,
  testID?: string,
  disabled?: boolean
}) {
  const colors = useColors();
  const haptics = useHaptics();
  
  const color = {
    primary: disabled ? colors.linkButtonTextPrimaryDisabled : colors.linkButtonTextPrimary,
    secondary: disabled ? colors.linkButtonTextSecondaryDisabled : colors.linkButtonTextSecondary,
    danger: disabled ? colors.linkButtonTextDangerDisabled : colors.linkButtonTextDanger,
  }[type]

  const Icon = FeatherIcons[icon as keyof typeof FeatherIcons];
  
  return (
    <Pressable
      style={({ pressed }) => [{
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.8 : 1,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
      }, style]}
      onPress={async () => {
        if(!disabled) {
          await haptics.selection()
          onPress()
        }
      }}
      testID={testID}
    >
      {icon && (
        <View style={{ marginRight: 5 }}>
          <Icon width={17} color={color} />
        </View>
      )}
      {children &&
        <Text 
          ellipsizeMode='tail' 
          numberOfLines={1}
          style={{ 
            fontSize: 17, 
            color: color,
            textAlign: 'center',
            ...textStyle,
          }}
        >{children}</Text>
      }
    </Pressable>
  )
}