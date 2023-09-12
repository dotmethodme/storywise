import { UserRespose } from "@/types/types";

export const useAdminStore = defineStore("admin", () => {
  const user = ref<UserRespose>();

  const fetchUser = async () => {
    const res = await useFetch<UserRespose>("/api/admin/user", { method: "GET" });
    if (res.data.value) {
      user.value = res.data.value;
    }
  };
  const setUser = (newUser: UserRespose) => {
    user.value = newUser;
  };

  return {
    user,
    fetchUser,
    setUser,
  };
});
