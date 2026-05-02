import { COLORS } from "@/constants/Colors";
import { Text, View } from "react-native";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  
};

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <View style={{gap:10}}>
      {title && (
        <Text
          style={{
            fontFamily: "SF Pro Display",
            fontWeight: "bold",
            fontSize: 22,
            color:COLORS.textPrimary,
          }}
        >
          {title}
        </Text>
      )}
      {subtitle && <Text  style={{
            fontFamily: "SF Pro Display",
            fontWeight: "600",
            fontSize: 14,
            color:COLORS.textSecondary,
          }}>{subtitle}</Text>}
    </View>
  );
};

export default Header;
