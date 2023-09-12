import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { verifyJwt } from "./jwtAuth";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.cookies?.storywise_token) {
    try {
      await verifyJwt(req.cookies.storywise_token);
      return next();
    } catch (err) {
      res.status(401).send("JWT Authentication failed");
    }
  }
  
  const expectedUser = process.env.STORYWISE_USERNAME ?? process.env.USERNAME ?? "admin";
  const expectedPass = process.env.STORYWISE_PASSWORD ?? process.env.PASSWORD ?? "123";
  const expectedPassHash = process.env.STORYWISE_PASSWORD_HASH ?? process.env.PASSWORD_HASH;

  const { authorization } = req.headers;

  if (!authorization) {
    res.set("WWW-Authenticate", 'Basic realm="401"');
    res.status(401).send("Authentication required.");
    return;
  }

  const { incomingUser, incomingPass } = extractCredentialsFromBasicAuthHeader(authorization);

  if (expectedPassHash) {
    const match = await bcrypt.compare(incomingPass, expectedPassHash);

    if (incomingUser === expectedUser && match) {
      return next();
    }

    res.set("WWW-Authenticate", 'Basic realm="401"');
    res.status(401).send("Authentication required.");
    return;
  }

  if (incomingUser === expectedUser && incomingPass === expectedPass) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="401"');
  res.status(401).send("Authentication required.");
}
function extractCredentialsFromBasicAuthHeader(authorization: string) {
  const [incomingUser, incomingPass] = Buffer.from(authorization.split(" ")[1], "base64").toString().split(":");
  return { incomingUser, incomingPass };
}
