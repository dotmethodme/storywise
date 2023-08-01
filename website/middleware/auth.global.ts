export default defineNuxtRouteMiddleware((to, from) => {
  if (!to.path.startsWith("/admin")) {
    return;
  }

  const { status, signIn } = useAuth();

  if (status.value === "authenticated") {
    return;
  }

  return signIn(undefined, { callbackUrl: to.path }) as ReturnType<
    typeof navigateTo
  >;
});
