import { NuxtAuthHandler } from "#auth";
import GithubProvider from "next-auth/providers/github";

const config = useRuntimeConfig();

export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
    }),
  ],
});
