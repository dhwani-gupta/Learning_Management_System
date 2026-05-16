import { View, Text } from "react-native";
import { StarIcon } from "phosphor-react-native";

type Course = {
  course: {
    title: "string";
    description: "string";
    price: number;
    rating: number;
  };
};

const CourseCard = ({ course }: Course) => {
  return (
    <View
      style={{
        width: "90%",
        height: "18%",
        backgroundColor: "pink",
        marginTop: 10,
        borderColor: "black",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 30,
        // justifyContent:'center'
      }}
    >
      <View
        style={{
          width: "95%",
          height: "50%",
          backgroundColor: "red",
          marginVertical: 10,
          borderColor: "black",
          borderWidth: 2,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Image</Text>
      </View>
      <View style={{ width: "90%", height: "50%", gap: 5 }}>
        <Text>{course.title}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {course.description}
        </Text>
        <Text>By Dhwani</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StarIcon size={20} weight="fill" />
            <Text>{course.rating}</Text>
          </View>
          <Text>Rs. {course.price}/-</Text>
        </View>
      </View>
    </View>
  );
};

export default CourseCard;
