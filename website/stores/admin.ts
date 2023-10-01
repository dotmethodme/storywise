import { UserRespose } from "~/types/types";
import { Subscription } from "~/types/lemonsqueezy";
import { StorywiseApp } from "~/types/types";

export const useAdminStore = defineStore("admin", () => {
  const appsLoading = ref(true);
  const apps = ref<StorywiseApp[]>([]);
  const user = ref<UserRespose>();
  const subscription = ref<Subscription>();
  const subscriptionLoading = ref(true);

  async function fetchUser() {
    const res = await useFetch<UserRespose>("/api/admin/user");
    if (res.data.value) {
      user.value = res.data.value;
    }
  }

  async function fetchApps() {
    appsLoading.value = true;
    const result = await useFetch<StorywiseApp[]>("/api/admin/app/list");
    if (result.data.value) {
      apps.value = result.data.value;
    }
    appsLoading.value = false;
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
    apps,
    appsLoading,
    fetchApps,
  };
});
