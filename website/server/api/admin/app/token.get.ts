import jwt from "jsonwebtoken";
import { StorywiseApp } from "@/types/types";

const config = useRuntimeConfig();

type Request = unknown;
type Response = Promise<StorywiseApp>;

export default defineEventHandler<Request, Response>(async (event) => {
  return {
    token: issueJwt(),
  };
});

export function issueJwt() {
  console.log(config);
  const privateKey = config.JWT_PRIVATE_KEY;

  if (privateKey === undefined) {
    throw new Error("Backend does not support JWTs");
  }

  const token = jwt.sign(
    {
      allowed: true,
    },
    privateKey,
    { algorithm: "RS256", expiresIn: "1m" }
  );

  return token;
}
