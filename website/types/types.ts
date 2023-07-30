import { WithId } from "mongodb";

type Session = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
};

type JWT = {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string | null;
  // iat: number;
  // exp: number;
  // jti: string;
};

export type Profile = {
  _id: string;
  email: string;
  externalId: string;
  onboarded: boolean;
  createdAt: string;
};

export type UserRespose = {
  session: Session;
  token: JWT;
  profile: Profile;
};

export type StorywiseApp = {
  name: string;
  createdAt: string;
  username: string;
  hashedPassword: string;
  ownerProfileId: string;
};

export type StorywiseAppCreate = {
  name: string;
  createdAt: string;
  username: string;
  password: string;
};

export type StorywiseAppPatch = {
  username: string;
  password?: string;
};

export type StorywiseAppWithId = WithId<StorywiseApp>;
