import { NuxtAuthHandler } from "#auth";
import GithubProvider from "next-auth/providers/github";

export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: "dfab111224bb23765053",
      clientSecret: "5082553dd4b4b765273a97a5fc8cbde2353b3085",
    }),
  ],
});
