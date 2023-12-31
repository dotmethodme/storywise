import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const publicKey = process.env.JWT_PUBLIC_KEY;

export async function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (publicKey === undefined) {
    return res.status(401).send("Backend does not support JWTs");
  }

  if (req.params.token === undefined) {
    return res.status(401).send("JWT Authentication required");
  }

  const token = req.params.token;

  try {
    await verifyJwt(token);

    res.cookie("storywise_token", token, { httpOnly: true });

    res.redirect("/admin");
  } catch (err) {
    res.status(401).send("JWT Authentication failed");
  }
}

export function verifyJwt(token: string) {
  const publicKey = process.env.JWT_PUBLIC_KEY;
  const appName = process.env.DATABASE_NAME;

  if (!publicKey || !appName) {
    throw new Error("Backend does not support JWTs");
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      if (!decoded || typeof decoded !== "object" || !("appName" in decoded)) {
        return reject(new Error("Invalid JWT"));
      }

      if (decoded.appName !== appName) {
        return reject(new Error("Invalid JWT"));
      }

      resolve(decoded);
    });
  });
}
