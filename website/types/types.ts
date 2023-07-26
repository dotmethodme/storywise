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
