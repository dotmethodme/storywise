<script setup lang="ts">
import Sessions from "@/components/UniqueSessions.vue";
import SessionsOverTime from "@/components/SessionsOverTime.vue";
import Referrers from "@/components/Referrers.vue";
</script>

<template>
  <main class="w-full">
    <SessionsOverTime />
    <div class="mt-10"></div>
    <Sessions />
    <div class="mt-10"></div>
    <Referrers />
  </main>
</template>
