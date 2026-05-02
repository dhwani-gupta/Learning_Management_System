import { Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({ label, onPress, style, textStyle }: ButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
