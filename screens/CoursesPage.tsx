import CourseCard from "@/components/CourseCard";
import { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { fetchCourses } from "@/src/api/courses";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data.data.data);
        // console.log(data.data.data)
      } catch (error) {
        console.log("Error fetching courses", error);
      }
    };
    getCourses();
  }, []);

  return (
    <View
      style={{ flex: 1, width: "100%",height:"auto", alignItems: "center" }}
    >
      <Text>Courses</Text>
      <ScrollView
        style={{ width: "100%", height:'100%' , flex:1}}
        contentContainerStyle={{ alignItems: "center", }}
      >
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </ScrollView>
    </View>
  );
};

export default CoursesPage;
