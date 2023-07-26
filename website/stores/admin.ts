import { UserRespose } from "types/types";

export const useAdminStore = defineStore("admin", () => {
  const user = ref<UserRespose>();
  const setUser = (newUser: UserRespose) => {
    user.value = newUser;
  };

  return {
    user,
    setUser,
  };
});
