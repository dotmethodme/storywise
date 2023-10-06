<script lang="ts" setup>
import { useAdminStore } from "~/stores/admin";
import { StorywiseApp } from "~/types/types";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const adminStore = useAdminStore();
const { apps, user, subscriptionLoading, subscription } = storeToRefs(adminStore);

const isLoading = computed(() => {
  if (!route.query.variantId) return false;
  if (!user.value) return false;
  if (subscriptionLoading.value) return true;
  if (subscription.value && subscription.value.attributes.status === "active") return false;
  return route.query.variantId && typeof route.query.variantId === "string";
});

adminStore.fetchApps();

watch(
  [route, user, subscription, subscriptionLoading],
  () => {
    if (subscriptionLoading.value) return;
    if (subscription.value && subscription.value.attributes.status === "active") return;

    const variantId = route.query.variantId;
    if (!variantId || typeof variantId !== "string") return;
    if (!user.value) return;
    const { email, id } = user.value.profile;

    const url = generateUrlByVariantId(variantId, email, id);
    if (!url) return;

    window.location.replace(url);
  },
  { immediate: true }
);

const showPricing = computed(() => {
  if (subscriptionLoading.value) return false;
  if (subscription.value && subscription.value.attributes.status === "active") return false;
  return true;
});
</script>

<template>
  <h1 class="serif font-bold text-3xl mb-8">Overview</h1>

  <div class="grid grid-cols-1 lg:grid-cols-2 select-none gap-4">
    <NuxtLink :to="`/admin/edit/${item.id}`" v-for="item in apps">
      <AdminAppLink :item="item" />
    </NuxtLink>

    <Usage />

    <!---
    <NuxtLink to="/admin/create">
      <div class="card bg-base-100 border cursor-pointer hover:shadow-lg h-full">
        <div class="card-body px-6 py-6">
          <h2 class="card-title">
            <Icon size="30px" name="system-uicons:plus-circle" />
            Create a new app
          </h2>
          <p>{{ createMessage }}</p>
        </div>
      </div>
    </NuxtLink>
    ----->
  </div>

  <div v-if="showPricing" class="border rounded-lg mt-4 py-8">
    <PricingSimple />
  </div>

  <div
    v-if="isLoading"
    class="fixed left-0 top-0 z-50 w-full h-full bg-base-100 flex justify-center items-center flex-col"
  >
    <div class="flex flex-row">
      <div href="/" class="normal-case px-4 font-bold text-4xl serif select-none">storywise</div>
      <span class="loading loading-ball loading-md -ml-4 -mb-1"></span>
    </div>

    <p class="mt-4 mb-10">You're being redirected to the payment portal...</p>
  </div>
</template>

<style scoped>
div {
  transition: all 0.2s ease-in-out;
}
</style>
