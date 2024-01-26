import express from "express";
import fs from "fs";
const app = express();
const port = 3000;
import jwt from "jsonwebtoken";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { authenticateJwt, Secret } from "./middleware/auth";
import { COURSE, ADMIN, USER } from "./interfaces/interfaces";

app.use(express.json());
app.use(cors());

let ADMINS: ADMIN[] = [];
let USERS: USER[] = [];
let COURSES: COURSE[] = [];

try {
  ADMINS = JSON.parse(fs.readFileSync("admins.json", "utf-8"));
  USERS = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  COURSES = JSON.parse(fs.readFileSync("courses.json", "utf-8"));
} catch {
  ADMINS = [];
  USERS = [];
  COURSES = [];
}

console.log(ADMINS);

app.post("/admin/signup", (req, res) => {
  const { username, password } = req.body;
  if (username == null || password == null) {
    res.status(403).json({ message: "Enter Valid Body" });
  }
  const admin = ADMINS.find((admin) => admin.username === username);
  console.log("Admins is " + ADMINS);
  if (admin) {
    res.status(403).json({ message: "Admin aldready exists" });
  } else {
    const newAdmin = { username, password };
    ADMINS.push(newAdmin);
    fs.writeFileSync("admins.json", JSON.stringify(ADMINS));
    const token = jwt.sign({ username, role: "Admin" }, Secret, {
      expiresIn: "1h",
    });
    res.json({ message: "Signup Successful", token });
  }
});

app.post("/admin/signin", (req, res) => {
  console.log("Inside /admin/signin");

  let Username = req.body.username;
  let password = req.body.password;
  console.log("username is " + Username + "password is " + password);
  const admin = ADMINS.find((admin) => admin.username === Username);
  console.log("admin is" + admin);
  if (admin) {
    let token = jwt.sign({ username: Username, role: "Admin" }, Secret, {
      expiresIn: "1h",
    });
    res.json({ message: "SignIn Successful", token });
  } else {
    res.status(301).json({ message: "Signin Failed" });
  }
});

app.get("/admin/me", authenticateJwt, (req, res) => {
  console.log("Inside admin/me");
  res.json({ username: req.headers["username"] });
});

//Route for Adding a course

app.post("/admin/addCourse", authenticateJwt, (req, res) => {
  let courseDetails = req.body;
  courseDetails.courseID = COURSES.length + 1;
  COURSES.push(courseDetails);
  fs.writeFileSync("courses.json", JSON.stringify(COURSES));
  res.status(200).json({ message: "Course Id is " + courseDetails.courseID });
});

app.get("/admin/courses", authenticateJwt, (req, res) => {
  console.log(req.headers["userName"]);
  if (req.headers["role"] === "Admin") {
    res.status(200).json({ Courses: COURSES });
  } else {
    res.status(402).json({ message: "No proper access" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
