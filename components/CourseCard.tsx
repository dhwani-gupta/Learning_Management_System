import { COLORS } from "@/constants/Colors";
import { Course } from "@/src/types/course";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CourseCardProps = {
  course: Course;
  onPress: () => void;
  onBookmarkPress: () => void;
  isBookmarked: boolean;
};

const CourseCard = ({
  course,
  onPress,
  onBookmarkPress,
  isBookmarked,
}: CourseCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Course Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{
            uri:
            //   course.thumbnail ||
            //   course.image ||
              "https://www.pexels.com/photo/stack-of-children-s-books-on-a-wooden-bookshelf-31024471/",
          }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.bookmarkBtn}
          onPress={(e) => {
            e.stopPropagation();
            onBookmarkPress();
          }}
        >
          <MaterialCommunityIcons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isBookmarked ? "#FF6B6B" : "#999999"}
          />
        </TouchableOpacity>
      </View>

      {/* Course Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {course.description}
        </Text>

        {/* Instructor */}
        {course.instructor && (
          <View style={styles.instructorRow}>
            <Text style={styles.instructorName}>
              By {course.instructor.firstName} {course.instructor.lastName}
            </Text>
          </View>
        )}

        {/* Rating and Price */}
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            {course.rating && (
              <>
                <Text style={styles.rating}>★ {course.rating.toFixed(1)}</Text>
                {course.reviews && (
                  <Text style={styles.reviews}>({course.reviews})</Text>
                )}
              </>
            )}
          </View>
          <Text style={styles.price}>${course.price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    height: 180,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  bookmarkBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  instructorRow: {
    marginBottom: 8,
  },
  instructorName: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  reviews: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.enabled,
  },
});

export default CourseCard;
