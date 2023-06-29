<script setup lang="ts">
import Sessions from "@/components/UniqueSessions.vue";
import SessionsOverTime from "@/components/SessionsOverTime.vue";
import Referrers from "@/components/Referrers.vue";
</script>

<template>
  <main class="w-full">
    <h1 class="mb-10 text-2xl font-extrabold tracking-tight text-gray-900">
      Storywise / <span class="text-gray-500">analytics made simple</span>
    </h1>
    <SessionsOverTime />
    <div class="mt-10"></div>
    <Sessions />
    <div class="mt-10"></div>
    <Referrers />
  </main>
</template>
