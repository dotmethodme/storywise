<script lang="ts" setup>
import { useAdminStore } from "@/stores/admin";

definePageMeta({
  layout: "admin",
});

const { data } = useAuth();
const store = useAdminStore();
const { user } = storeToRefs(store);
</script>

<template>
  <h1 class="serif font-bold text-3xl mb-4">Overview</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    <div class="card bg-base-100 border">
      <div class="card-body px-6 py-6">
        <h2 class="card-title">Create a new app</h2>
        <p>Start using storywise by creating a new app</p>
      </div>
    </div>
  </div>
</template>
