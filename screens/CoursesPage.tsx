import CourseCard from "@/components/CourseCard";
import { COLORS } from "@/constants/Colors";
import { fetchCourses, fetchInstructors } from "@/src/api/courses";
import { Course, Instructor } from "@/src/types/course";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const CoursesPage = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Load bookmarks from local storage
  const loadBookmarks = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedCourses");
      if (savedBookmarks) {
        setBookmarks(new Set(JSON.parse(savedBookmarks)));
      }
    } catch (error) {
      console.log("Error loading bookmarks:", error);
    }
  };

  // Save bookmarks to local storage
  const saveBookmarks = async (updatedBookmarks: Set<string>) => {
    try {
      await AsyncStorage.setItem(
        "bookmarkedCourses",
        JSON.stringify(Array.from(updatedBookmarks)),
      );
    } catch (error) {
      console.log("Error saving bookmarks:", error);
    }
  };

  // Fetch courses and instructors
  const loadCourses = async () => {
    try {
      setLoading(true);
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
          (course: any, index: number) => ({
            id: course.id || `course-${index}`,
            title: course.title || "Untitled Course",
            description: course.description || "",
            price: course.price || 0,
            thumbnail: course.thumbnail || course.image || "",
            image: course.image || course.thumbnail || "",
            rating: course.rating || 0,
            reviews: course.stock || 0,
            instructor:
              instructorsMap[index % Object.keys(instructorsMap).length],
          }),
        );

        setCourses(coursesWithInstructors);
        setFilteredCourses(coursesWithInstructors);
      }
    } catch (error: any) {
      console.log("Error loading courses:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to load courses";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCourses();
    loadBookmarks();
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.description.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredCourses(filtered);
    }
  };

  // Handle pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  }, []);

  // Toggle bookmark
  const toggleBookmark = (courseId: string) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(courseId)) {
      newBookmarks.delete(courseId);
    } else {
      newBookmarks.add(courseId);
    }
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Courses</Text>
        <Text style={styles.headerSubtitle}>
          Explore amazing learning opportunities
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={COLORS.textLight}
          style={styles.searchIcon}
        />
      </View>

      {/* Courses List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.enabled} />
        </View>
      ) : filteredCourses.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>
            {searchQuery ? "No courses found" : "No courses available"}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() =>
                router.push({
                  pathname: "/course-details",
                  params: { id: course.id },
                })
              }
              onBookmarkPress={() => toggleBookmark(course.id)}
              isBookmarked={bookmarks.has(course.id)}
            />
          ))}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    position: "relative",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingRight: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default CoursesPage;
