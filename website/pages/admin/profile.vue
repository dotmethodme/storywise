<script lang="ts" setup>
import { useAdminStore } from "@/stores/admin";

definePageMeta({
  layout: "admin",
});

const { user } = useAdminStore();
</script>
<template>
  <h1 class="serif font-bold text-3xl mb-4">Profile</h1>

  <div class="flex gap-4 items-center" v-if="user">
    <div class="avatar" v-if="user.session.user?.image">
      <div class="w-24 mask mask-squircle">
        <img :src="user.session.user?.image" />
      </div>
    </div>
    <div>
      <h1 class="text-2xl serif">{{ user.session.user?.name }}</h1>
      <p class="opacity-60">{{ user.profile.email }}</p>
      <p class="opacity-60">Organization: {{ user.profile.organization.name }}</p>
    </div>
  </div>
</template>
