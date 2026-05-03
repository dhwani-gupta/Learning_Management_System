import { COLORS } from "@/constants/Colors";
import CoursesPage from "@/screens/CoursesPage";
import ProfileScreen from "@/screens/ProfileScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    BottomTabNavigationOptions,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const tabScreenOptions = (): BottomTabNavigationOptions => ({
    tabBarActiveTintColor: COLORS.enabled,
    tabBarInactiveTintColor: COLORS.textLight,
    tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
    tabBarStyle: {
      backgroundColor: "#fff",
      borderTopColor: COLORS.border,
      borderTopWidth: 1,
      paddingBottom: 8,
      paddingTop: 8,
    },
    headerShown: false,
  });

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="courses"
        component={CoursesPage}
        options={{
          title: "Courses",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-open-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
