// extend the global Session interface
import { DefaultSession } from "next-auth";
import { ProfileWithOrganization } from "types/types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    // profile: Profile;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "h3" {
  interface H3EventContext {
    params?: Record<string, string>;
    sessions?: Record<string, Session>;
    profile: ProfileWithOrganization;
  }
}
