<script setup lang="ts">
import { useAdminStore } from "@/stores/admin";

const store = useAdminStore();
const { user, apps, appsLoading, subscription, subscriptionLoading } = storeToRefs(store);
const router = useRouter();

onMounted(async () => {
  store.fetchUser();
  store.fetchSubscription();
});

watch([appsLoading, apps], () => {
  if (appsLoading.value || subscriptionLoading.value) return;
  if (!subscription.value) return;
  if (apps.value.length === 0) {
    router.push("/admin/create");
  }
});

const path = computed(() => {
  if (router.currentRoute.value.path == "/admin") {
    return "overview";
  } else if (router.currentRoute.value.path == "/admin/subscription") {
    return "subscription";
  } else if (router.currentRoute.value.path == "/admin/organization") {
    return "organization";
  } else if (router.currentRoute.value.path == "/admin/profile") {
    return "profile";
  }
});
</script>

<template>
  <div class="drawer lg:drawer-open h-screen">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content h-full overflow-x-scroll">
      <label
        for="my-drawer-2"
        class="btn btn-primary drawer-button lg:hidden fixed bottom-4 left-4 opacity-1 rounded-full"
      >
        <IconsMenu />
      </label>

      <div class="p-8">
        <slot />
      </div>
    </div>

    <div class="drawer-side border-r">
      <label for="my-drawer-2" class="drawer-overlay"></label>

      <div class="flex flex-col justify-between h-full">
        <div>
          <NuxtLink
            href="/admin"
            class="normal-case px-8 pt-8 pb-4 font-bold text-2xl serif text-center w-full flex"
          >
            storywise.
          </NuxtLink>

          <ul class="menu p-4 w-80 h-full bg-base-100 text-accent-content border-base-200 gap-1">
            <li>
              <NuxtLink :class="{ focus: path === 'overview' }" href="/admin">
                <Icon size="24px" name="system-uicons:home-door" />
                Overview
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :class="{ focus: path === 'subscription' }" href="/admin/subscription">
                <Icon size="24px" name="system-uicons:settings" />
                Subscription
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :class="{ focus: path === 'organization' }" href="/admin/organization">
                <Icon size="24px" name="octicon:organization-24" />
                Organization
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <ul class="menu p-4 w-80 h-full bg-base-100 text-accent-content border-base-200">
            <li>
              <NuxtLink :class="{ focus: path === 'profile' }" href="/admin/profile">
                <div class="avatar" v-if="user?.session.user?.image">
                  <div class="w-8 rounded-full">
                    <img :src="user?.session.user?.image" />
                  </div>
                </div>
                Profile
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
