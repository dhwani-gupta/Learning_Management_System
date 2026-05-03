import { COLORS } from "@/constants/Colors";
import { useAuth } from "@/src/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ProfileScreen = () => {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
            router.replace("/");
          } catch {
            Alert.alert("Error", "Failed to logout. Please try again.");
            setLoggingOut(false);
          }
        },
        style: "destructive",
      },
    ]);
  }, [logout, router]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.enabled} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <MaterialCommunityIcons
                name="account-circle"
                size={80}
                color={COLORS.textLight}
              />
            </View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>
            {user?.fullName || user?.username || "User"}
          </Text>
          <Text style={styles.userEmail}>{user?.email || "No email"}</Text>
          <View style={styles.userIdBadge}>
            <Text style={styles.userIdText}>ID: {user?._id?.slice(0, 8)}</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editButton}>
          <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="book"
            size={32}
            color={COLORS.enabled}
          />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Courses Enrolled</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="progress-check"
            size={32}
            color={COLORS.enabled}
          />
          <Text style={styles.statValue}>0%</Text>
          <Text style={styles.statLabel}>Overall Progress</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="star"
            size={32}
            color={COLORS.enabled}
          />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Certifications</Text>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <TouchableOpacity style={styles.settingItem}>
          <MaterialCommunityIcons
            name="lock"
            size={20}
            color={COLORS.textPrimary}
          />
          <Text style={styles.settingText}>Change Password</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <MaterialCommunityIcons
            name="bell"
            size={20}
            color={COLORS.textPrimary}
          />
          <Text style={styles.settingText}>Notifications</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <MaterialCommunityIcons
            name="download"
            size={20}
            color={COLORS.textPrimary}
          />
          <Text style={styles.settingText}>Download Data</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color={COLORS.textPrimary}
          />
          <Text style={styles.settingText}>About App</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity
          style={[styles.logoutButton, loggingOut && { opacity: 0.6 }]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <MaterialCommunityIcons name="logout" size={18} color="#fff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  profileCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  userIdBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userIdText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: COLORS.enabled,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  settingsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    gap: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  logoutButtonContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ProfileScreen;
