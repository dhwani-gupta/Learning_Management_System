import CourseCard from "@/components/CourseCard";
import { COLORS } from "@/constants/Colors";
import { fetchCourses, fetchInstructors } from "@/src/api/courses";
import { useAuth } from "@/src/context/AuthContext";
import { Course, Instructor } from "@/src/types/course";
import { courseImageUrl } from "@/src/utils/image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
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
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkedCourses, setBookmarkedCourses] = useState<Course[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  // Load bookmarks from local storage
  const loadBookmarks = useCallback(async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedCourses");
      if (savedBookmarks) {
        setBookmarks(new Set(JSON.parse(savedBookmarks)));
      }
    } catch (error) {
      console.log("Error loading bookmarks:", error);
      // Silently fail - bookmarks will be empty
    }
  }, []);

  // Save bookmarks to local storage
  const saveBookmarks = useCallback(async (updatedBookmarks: Set<string>) => {
    try {
      await AsyncStorage.setItem(
        "bookmarkedCourses",
        JSON.stringify(Array.from(updatedBookmarks)),
      );
    } catch (error) {
      console.log("Error saving bookmarks:", error);
    }
  }, []);

  // Fetch all courses and filter by bookmarks
  const loadBookmarkedCoursesList = useCallback(async () => {
    try {
      setBookmarksLoading(true);
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedCourses");
      const bookmarkList = savedBookmarks ? JSON.parse(savedBookmarks) : [];

      const [coursesRes, instructorsRes] = await Promise.all([
        fetchCourses(),
        fetchInstructors(),
      ]);

      // Handle the nested data structure from API
      let coursesList = [];
      if (coursesRes?.data?.data && Array.isArray(coursesRes.data.data)) {
        coursesList = coursesRes.data.data;
      } else if (coursesRes?.data && Array.isArray(coursesRes.data)) {
        coursesList = coursesRes.data;
      }

      if (coursesList.length > 0) {
        const instructorsMap: { [key: string]: Instructor } = {};
        let instructorsData = [];

        if (
          instructorsRes?.data?.data &&
          Array.isArray(instructorsRes.data.data)
        ) {
          instructorsData = instructorsRes.data.data;
        } else if (instructorsRes?.data && Array.isArray(instructorsRes.data)) {
          instructorsData = instructorsRes.data;
        }

        instructorsData.forEach((instructor: any, index: number) => {
          instructorsMap[index] = {
            id: instructor.id || `instructor-${index}`,
            firstName:
              instructor.firstName ||
              instructor.first_name ||
              instructor.name?.first ||
              "Unknown",
            lastName:
              instructor.lastName ||
              instructor.last_name ||
              instructor.name?.last ||
              "",
            email: instructor.email || "",
            avatar:
              instructor.avatar ||
              instructor.image ||
              instructor.picture?.thumbnail ||
              "",
          };
        });

        const coursesWithInstructors = coursesList.map(
          (course: any, index: number) => {
            const id = course.id || `course-${index}`;
            const thumb =
              course.thumbnail || course.image || course.imageUrl || "";
            const image =
              course.image || course.thumbnail || course.imageUrl || "";

            return {
              id,
              title: course.title || "Untitled Course",
              description: course.description || "",
              price: course.price || 0,
              thumbnail: thumb || courseImageUrl(id, 600, 400),
              image: image || courseImageUrl(id, 900, 500),
              rating: course.rating || 0,
              reviews: course.stock || 0,
              instructor:
                instructorsMap[index % Object.keys(instructorsMap).length],
            };
          },
        );

        // Filter by bookmarks
        const filtered = coursesWithInstructors.filter((course: Course) =>
          bookmarkList.includes(course.id),
        );
        setBookmarkedCourses(filtered);
        setBookmarks(new Set(bookmarkList as string[]));
      }
    } catch (error: any) {
      console.log("Error loading bookmarks:", error);
    } finally {
      setBookmarksLoading(false);
    }
  }, []);

  // Refresh bookmarks when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [loadBookmarks]),
  );

  // Toggle bookmark
  const toggleBookmark = useCallback(
    (courseId: string) => {
      const newBookmarks = new Set(bookmarks);
      if (newBookmarks.has(courseId)) {
        newBookmarks.delete(courseId);
      } else {
        newBookmarks.add(courseId);
      }
      setBookmarks(newBookmarks);
      saveBookmarks(newBookmarks);
    },
    [bookmarks, saveBookmarks],
  );

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

  // Handle opening bookmarks modal
  const handleOpenBookmarks = useCallback(async () => {
    setShowBookmarks(true);
    await loadBookmarkedCoursesList();
  }, [loadBookmarkedCoursesList]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.enabled} />
      </View>
    );
  }

  if (showBookmarks) {
    return (
      <View style={styles.container}>
        {/* Bookmarks Header */}
        <View style={styles.bookmarksHeader}>
          <TouchableOpacity onPress={() => setShowBookmarks(false)}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.bookmarksHeaderTitle}>My Bookmarks</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Bookmarks List */}
        {bookmarksLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.enabled} />
          </View>
        ) : bookmarkedCourses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="bookmark-outline"
              size={48}
              color={COLORS.textLight}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.emptyText}>
              {bookmarks.size === 0 ? "No bookmarks yet" : "No bookmarks"}
            </Text>
            <Text style={styles.emptySubtext}>
              {bookmarks.size === 0
                ? "Bookmark courses from the Courses tab to save them here"
                : ""}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.bookmarksList}
            showsVerticalScrollIndicator={false}
          >
            {bookmarkedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => {
                  setShowBookmarks(false);
                  router.push({
                    pathname: "/(auth)/course-details",
                    params: { id: course.id },
                  });
                }}
                onBookmarkPress={async () => {
                  await toggleBookmark(course.id);
                  await loadBookmarkedCoursesList();
                }}
                isBookmarked={bookmarks.has(course.id)}
              />
            ))}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        )}
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
          (
          <View style={styles.avatarPlaceholder}>
            <MaterialCommunityIcons
              name="account-circle"
              size={80}
              color={COLORS.textLight}
            />
          </View>
          )
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

      {/* Bookmarked Courses Button */}
      <TouchableOpacity
        style={styles.bookmarksButton}
        onPress={handleOpenBookmarks}
      >
        <View style={styles.bookmarksButtonLeft}>
          <MaterialCommunityIcons
            name="bookmark"
            size={24}
            color={COLORS.enabled}
          />
          <View>
            <Text style={styles.bookmarksButtonTitle}>My Bookmarks</Text>
            <Text style={styles.bookmarksButtonSubtitle}>
              {bookmarks.size} course{bookmarks.size !== 1 ? "s" : ""} saved
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={COLORS.textLight}
        />
      </TouchableOpacity>

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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  bookmarksHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bookmarksHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
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
  bookmarksButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  bookmarksButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  bookmarksButtonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  bookmarksButtonSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
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
  bookmarksList: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ProfileScreen;
