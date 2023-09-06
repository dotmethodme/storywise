import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { verifyJwt } from "./jwtAuth";

const user = process.env.USERNAME || "admin";
const pass = process.env.PASSWORD || "123";
const passHash = process.env.PASSWORD_HASH;

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.cookies?.storywise_token) {
    try {
      await verifyJwt(req.cookies.storywise_token);
      console.debug("JWT Authentication successful");
      return next();
    } catch (err) {
      res.status(401).send("JWT Authentication failed");
    }
  }

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
      console.debug("Username and password (hash) authentication successful");
      return next();
    }

    res.set("WWW-Authenticate", 'Basic realm="401"');
    res.status(401).send("Authentication required.");
    return;
  }

  if (username === user && password === pass) {
    console.debug("Username and password authentication successful");
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
}
