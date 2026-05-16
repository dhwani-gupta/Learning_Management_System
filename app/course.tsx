import CoursesPage from "@/screens/CoursesPage";
import { View } from "react-native";

export default function Course() {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 60,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <CoursesPage/>
    </View>
  );
}