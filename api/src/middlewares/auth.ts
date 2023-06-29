import { NextFunction, Request, Response } from "express";

const user = process.env.USERNAME || "admin";
const pass = process.env.PASSWORD || "123";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.set("WWW-Authenticate", 'Basic realm="401"');
    res.status(401).send("Authentication required.");
    return;
  }

  const [username, password] = Buffer.from(authorization.split(" ")[1], "base64").toString().split(":");

  if (username === user && password === pass) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
}
