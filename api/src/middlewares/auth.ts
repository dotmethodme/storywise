import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

const user = process.env.STORYWISE_USERNAME || process.env.USERNAME || "admin";
const pass = process.env.STORYWISE_PASSWORD || process.env.PASSWORD || "123";
const passHash = process.env.STORYWISE_PASSWORD_HASH || process.env.PASSWORD_HASH;

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.set("WWW-Authenticate", 'Basic realm="401"');
    res.status(401).send("Authentication required.");
    return;
  }

  const [username, password] = Buffer.from(authorization.split(" ")[1], "base64").toString().split(":");

  if (passHash) {
    const match = await bcrypt.compare(password, passHash);

    if (username === user && match) {
      return next();
    }

    res.set("WWW-Authenticate", 'Basic realm="401"');
    res.status(401).send("Authentication required.");
    return;
  }

  if (username === user && password === pass) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
}
