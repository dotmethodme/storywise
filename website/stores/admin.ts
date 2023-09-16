import { UserRespose } from "@/types/types";
import { Subscription } from "~/types/lemonsqueezy";

export const useAdminStore = defineStore("admin", () => {
  const user = ref<UserRespose>();
  const subscription = ref<Subscription>();
  const subscriptionLoading = ref(true);

  async function fetchUser() {
    const res = await useFetch<UserRespose>("/api/admin/user");
    if (res.data.value) {
      user.value = res.data.value;
    }
  }

  async function fetchSubscription() {
    subscriptionLoading.value = true;
    const res = await useFetch<Subscription>("/api/admin/subscription");
    if (res.data.value) {
      subscription.value = res.data.value;
    }
    subscriptionLoading.value = false;
  }

  return {
    user,
    fetchUser,
    subscription,
    subscriptionLoading,
    fetchSubscription,
  };
});
