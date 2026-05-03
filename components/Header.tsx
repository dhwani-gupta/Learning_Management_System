import { COLORS } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontWeight: "600",
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default Header;
