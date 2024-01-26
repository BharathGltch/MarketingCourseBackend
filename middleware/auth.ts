import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
export const Secret = "my-secret-key";

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  //console.log("Header is " + authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("The Token is " + token);
    jwt.verify(token, Secret, (err, user) => {
      console.log("The user is " + JSON.stringify(user));
      if (err) {
        console.log("inside error");
        return res.sendStatus(403);
      }

      if (!user) {
        return res.sendStatus(403);
      }

      if (typeof user == "string") {
        return res.sendStatus(403);
      }
      console.log("username is " + user.username);
      req.headers["username"] = user.username;
      req.headers["role"] = user.role;
      console.log(req.headers["username"]);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
