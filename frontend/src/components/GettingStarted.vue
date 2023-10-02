<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

const store = useGlobalStore();
store.activeAppId;
</script>
<template>
  <div class="hero min-h-full bg-base-200 mt-4 p-10 rounded-lg">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Let's get started!</h1>
        <p class="py-6">
          Welcome to storywise! It seems you're just about to get started. Let's create your first event and
          start gathering some data in your dashboard.
        </p>

        <a :href="`#/${store.activeAppId}/about`" class="btn btn-primary">Get Started</a>

        <p class="py-6">
          If you'd like to see a demo first, check out
          <a href="https://demo.joinstorywise.com/admin/" class="link"> this link</a>
        </p>
      </div>
    </div>
  </div>
</template>
