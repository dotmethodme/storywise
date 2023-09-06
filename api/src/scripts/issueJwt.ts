require("dotenv").config();
import jwt from "jsonwebtoken";

const privateKey = process.env.JWT_PRIVATE_KEY;

export function issueJwt() {
  if (privateKey === undefined) {
    throw new Error("Backend does not support JWTs");
  }

  const token = jwt.sign(
    {
      allowed: true,
    },
    privateKey,
    { algorithm: "RS256", expiresIn: "1h" }
  );

  console.log(token);
}

issueJwt();
