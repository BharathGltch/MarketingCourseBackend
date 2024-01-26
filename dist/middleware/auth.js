"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.Secret = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.Secret = "my-secret-key";
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //console.log("Header is " + authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log("The Token is " + token);
        jsonwebtoken_1.default.verify(token, exports.Secret, (err, user) => {
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
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJwt = authenticateJwt;
