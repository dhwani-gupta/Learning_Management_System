export type Instructor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  instructorId?: string;
  instructor?: Instructor;
};

export type CoursesResponse = {
  statusCode: number;
  data: Course[];
  message: string;
  success: boolean;
};

export type InstructorsResponse = {
  statusCode: number;
  data: Instructor[];
  message: string;
  success: boolean;
};
