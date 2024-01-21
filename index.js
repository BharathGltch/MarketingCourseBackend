const express = require("express");
const fs=require("fs");
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const cors=require("cors");

app.use(express.json());
app.use(cors());

const Secret='my-secret-key';

let ADMINS=[];
let USERS=[];
let COURSES=[];

try{
ADMINS= JSON.parse(fs.readFileSync("admins.json","utf-8"));
USERS=JSON.parse(fs.readFileSync("users.json","utf-8"));
COURSES=JSON.parse(fs.readFileSync("courses.json","utf-8"));
}catch{

  ADMINS=[];
  USERS=[]; 
  COURSES=[];
}

console.log(ADMINS)

const authenticateJwt=(req,res,next)=>{
const authHeader=req.headers.authorization;
console.log("Header is"+ authHeader);
if(authHeader){
  const token=authHeader.split(' ')[1];
  jwt.verify(token,Secret,(err,user)=>{
    if(err){
      console.log("inside error");
     return res.sendStatus(403);
    }
    req.user=user;
    console.log(req.user);
    next();
  })
}else{
  res.sendStatus(401);
}
}
app.post("/admin/signup", (req, res) => {
  const {username,password}=req.body;
  const admin=ADMINS.find(admin=>admin.username===username);
  console.log("Admins is "+ADMINS);
  if(admin){
    res.status(403).json({message:"Admin aldready exists"});
  }else{
    const newAdmin={username,password};
    ADMINS.push(newAdmin);
    fs.writeFileSync("admins.json",JSON.stringify(ADMINS));
    const token=jwt.sign({username,role:'Admin'},Secret,{expiresIn:'1h'});
    res.json({message:'Signup Successful',token});
  }

});

app.post("/admin/signin",(req,res)=>{
  let Username=req.body.username;
  let password=req.body.password;
  console.log("username is "+Username+ "password is "+password);
  const admin=ADMINS.find(admin=>admin.username===Username);
  console.log("admin is"+admin);
  if(admin){
      let token=jwt.sign({username:Username,role:'Admin'},Secret,{expiresIn:'1h'});
      res.json({message:'SignIn Successful',token});
  }else{
    res.status(301).json({message:"Signin Failed"});
  }
})

app.get("/admin/me",authenticateJwt,(req,res)=>{
   res.json(req.user);
})

//Route for Adding a course

app.post("/admin/addCourse",authenticateJwt,(req,res)=>{
     let courseDetails=req.body;
     courseDetails.courseID=COURSES.length+1;
     COURSES.push(courseDetails);
     fs.writeFileSync("courses.json",JSON.stringify(COURSES));
     res.status(200).json({message:"Course Id is "+ courseDetails.courseID})
})

app.get("/admin/courses",authenticateJwt,(req,res)=>{
  console.log(req.user);
    if(req.user.role==='Admin'){
      res.status(200).json({"Courses":COURSES});
    }else{
      res.status(402).json({"message":"No proper access"})
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
