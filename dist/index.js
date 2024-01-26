"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./middleware/auth");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
let ADMINS = [];
let USERS = [];
let COURSES = [];
try {
    ADMINS = JSON.parse(fs_1.default.readFileSync("admins.json", "utf-8"));
    USERS = JSON.parse(fs_1.default.readFileSync("users.json", "utf-8"));
    COURSES = JSON.parse(fs_1.default.readFileSync("courses.json", "utf-8"));
}
catch (_a) {
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
    }
    else {
        const newAdmin = { username, password };
        ADMINS.push(newAdmin);
        fs_1.default.writeFileSync("admins.json", JSON.stringify(ADMINS));
        const token = jsonwebtoken_1.default.sign({ username, role: "Admin" }, auth_1.Secret, {
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
        let token = jsonwebtoken_1.default.sign({ username: Username, role: "Admin" }, auth_1.Secret, {
            expiresIn: "1h",
        });
        res.json({ message: "SignIn Successful", token });
    }
    else {
        res.status(301).json({ message: "Signin Failed" });
    }
});
app.get("/admin/me", auth_1.authenticateJwt, (req, res) => {
    console.log("Inside admin/me");
    res.json({ username: req.headers["username"] });
});
//Route for Adding a course
app.post("/admin/addCourse", auth_1.authenticateJwt, (req, res) => {
    let courseDetails = req.body;
    courseDetails.courseID = COURSES.length + 1;
    COURSES.push(courseDetails);
    fs_1.default.writeFileSync("courses.json", JSON.stringify(COURSES));
    res.status(200).json({ message: "Course Id is " + courseDetails.courseID });
});
app.get("/admin/courses", auth_1.authenticateJwt, (req, res) => {
    console.log(req.headers["userName"]);
    if (req.headers["role"] === "Admin") {
        res.status(200).json({ Courses: COURSES });
    }
    else {
        res.status(402).json({ message: "No proper access" });
    }
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
