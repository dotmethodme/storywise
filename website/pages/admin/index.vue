<script lang="ts" setup>
import { useAdminStore } from "~/stores/admin";
import { StorywiseApp } from "~/types/types";

definePageMeta({
  layout: "admin",
});

const result = useFetch<StorywiseApp[]>("/api/admin/app/list");

const list = computed(() => {
  if (!result.data.value) return;
  return result.data.value;
});

const createMessage = computed(() => {
  if (!result.data.value) return;
  if (result.data.value.length === 0) {
    return "Start using storywise by creating a new app. Click here!";
  }
  return "If you want to track a new app, click here!";
});

const route = useRoute();

const adminStore = useAdminStore();
const { user } = storeToRefs(adminStore);

const isLoading = computed(() => {
  if (!user.value) return false;
  return route.query.variantId && typeof route.query.variantId === "string";
});

onMounted(() => {
  if (!user.value) return;
  const variantId = route.query.variantId;
  if (!variantId || typeof variantId !== "string") return;

  const { email, id } = user.value.profile;

  const url = generateUrlByVariantId(variantId, email, id);
  if (!url) return;

  window.location.replace(url);

  // window.createLemonSqueezy();
  // LemonSqueezy.Url.Open(url);
});
</script>

<template>
  <h1 class="serif font-bold text-3xl mb-8">Overview</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2-xl:grid-cols-4 select-none gap-4">
    <NuxtLink :to="`/admin/edit/${item.id}`" v-for="item in list">
      <AdminAppLink :item="item" />
    </NuxtLink>

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
