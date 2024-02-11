import type { Organization, Profile } from "@prisma/client";

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

export type ProfileWithOrganization = Profile & { organization: Organization };

export type UserRespose = {
  session: Session;
  token: JWT;
  profile: ProfileWithOrganization;
};

export type StorywiseApp = {
  id: string;
  name: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  organizationId: string;
};

export type StorywiseAppCreate = {
  name: string;
  createdAt: string;
  username: string;
  password: string;
};

export type StorywiseAppPatch = {
  id: string;
  username: string;
  password?: string;
};

export type DatabaseSize = {
  sizeBytes: string;
  sizePretty: string;
};
