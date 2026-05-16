import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?:boolean;
};

const Button = ({ label, onPress, style, textStyle, disabled }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={style} disabled={disabled}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
