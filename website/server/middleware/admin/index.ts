import { getServerSession } from "#auth";

export default eventHandler(async (event) => {
  if (event.path.startsWith("/api/admin")) {
    const session = await getServerSession(event);

    if (!session) {
      throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }
  }
});
