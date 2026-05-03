import axios from "axios";

const API = axios.create({
  baseURL: "https://api.freeapi.app/api/v1",
  timeout: 5000,
});

// Fetch courses (using randomproducts endpoint)
export const fetchCourses = async () => {
  const res = await API.get("/public/randomproducts");
  return res.data;
};

// Fetch instructors (using randomusers endpoint)
export const fetchInstructors = async () => {
  const res = await API.get("/public/randomusers");
  return res.data;
};
