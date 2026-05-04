import Button from "@/components/Button";
import { COLORS } from "@/constants/Colors";
import { fetchCourses, fetchInstructors } from "@/src/api/courses";
import { Course } from "@/src/types/course";
import { courseImageUrl } from "@/src/utils/image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

const CourseDetailsPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const checkBookmarkStatus = useCallback(async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedCourses");
      if (savedBookmarks && id) {
        const bookmarkList = JSON.parse(savedBookmarks);
        setIsBookmarked(bookmarkList.includes(id));
      }
    } catch (error) {
      console.log("Error checking bookmark:", error);
      // Silently fail - bookmark will be false
    }
  }, [id]);

  const loadCourseDetails = useCallback(async () => {
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
        const instructorsMap: { [key: string]: any } = {};
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
            thumbnail:
              course.thumbnail ||
              course.image ||
              courseImageUrl(`course-${index}`, 600, 400),
            image:
              course.image ||
              course.thumbnail ||
              courseImageUrl(`course-${index}`, 900, 500),
            rating: course.rating || 0,
            reviews: course.stock || 0,
            instructor:
              instructorsMap[index % Object.keys(instructorsMap).length],
          }),
        );

        const selectedCourse = coursesWithInstructors.find(
          (c: any) => String(c.id) === String(id),
        );
        if (selectedCourse) {
          setCourse(selectedCourse);
        } else {
          Alert.alert("Error", "Course not found");
        }
      }
    } catch (error: any) {
      console.log("Failed to load course details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadCourseDetails();
      checkBookmarkStatus();
    }
  }, [id, loadCourseDetails, checkBookmarkStatus]);

  const handleBookmarkToggle = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedCourses");
      let bookmarkList = savedBookmarks ? JSON.parse(savedBookmarks) : [];

      if (isBookmarked) {
        bookmarkList = bookmarkList.filter((b: string) => b !== id);
      } else {
        bookmarkList.push(id);
      }

      await AsyncStorage.setItem(
        "bookmarkedCourses",
        JSON.stringify(bookmarkList),
      );
      setIsBookmarked(!isBookmarked);
    } catch (error: any) {
      console.log("Error updating bookmark:", error);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    // Simulate enrollment
    setTimeout(() => {
      Alert.alert("Success", "You have successfully enrolled in this course!", [
        {
          text: "OK",
          onPress: () => {
            setEnrolling(false);
            router.back();
          },
        },
      ]);
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.enabled} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Course Thumbnail */}
      <Image
        source={{
          uri:
            course.image ||
            course.thumbnail ||
            courseImageUrl(course.id, 900, 500),
        }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* Bookmark Button */}
      <TouchableOpacity
        style={styles.bookmarkButton}
        onPress={handleBookmarkToggle}
      >
        <MaterialCommunityIcons
          name={isBookmarked ? "bookmark" : "bookmark-outline"}
          size={24}
          color={isBookmarked ? "#FF6B6B" : "#999999"}
        />
      </TouchableOpacity>

      {/* Course Info */}
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>

        {/* Rating and Reviews */}
        {course.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {course.rating.toFixed(1)}</Text>
            {course.reviews && (
              <Text style={styles.reviews}>({course.reviews} reviews)</Text>
            )}
          </View>
        )}

        {/* Instructor */}
        {course.instructor && (
          <View style={styles.instructorContainer}>
            <Text style={styles.instructorLabel}>Instructor</Text>
            <Text style={styles.instructorName}>
              {course.instructor.firstName} {course.instructor.lastName}
            </Text>
            <Text style={styles.instructorEmail}>
              {course.instructor.email}
            </Text>
          </View>
        )}

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Course Fee</Text>
          <Text style={styles.price}>${course.price.toFixed(2)}</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>About this course</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>

        {/* Enroll Button */}
        <Button
          label={enrolling ? "Enrolling..." : "Enroll Now"}
          onPress={enrolling ? undefined : handleEnroll}
          style={{
            ...styles.enrollButton,
            backgroundColor: enrolling ? COLORS.disabled : COLORS.enabled,
          }}
          textStyle={styles.enrollButtonText}
        />

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  thumbnail: {
    width: "100%",
    height: 250,
  },
  bookmarkButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  reviews: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  instructorContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.enabled,
  },
  instructorLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  instructorEmail: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  priceContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.enabled,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  enrollButton: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  enrollButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomSpacing: {
    height: 20,
  },
});

export default CourseDetailsPage;
