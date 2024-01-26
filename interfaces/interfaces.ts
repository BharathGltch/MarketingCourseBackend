export interface ADMIN {
  username: string;
  password: string;
}

export interface COURSE {
  courseName: string;
  courseImage: string;
  courseDescription: string;
  courseID: number;
}

export interface USER {
  userName: string;
  userPassword: string;
  Courses: COURSE[];
}
