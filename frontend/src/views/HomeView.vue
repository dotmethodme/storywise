<script setup lang="ts">
import Sessions from "@/components/UniqueSessions.vue";
import SessionsOverTime from "@/components/SessionsOverTime.vue";
import Referrers from "@/components/Referrers.vue";
import Stats from "@/components/Stats.vue";

import { useGlobalStore } from "@/stores/counter";

const store = useGlobalStore();

const dayOptions = [7, 14, 30, 90];
</script>

<template>
  <main class="w-full">
    <h1 class="mb-5 text-2xl font-extrabold tracking-tight text-gray-900">
      Storywise / <span class="text-gray-500">analytics made simple</span>
    </h1>

    <div class="flex mb-4 mt-4 justify-between">
      <h2 class="text-xl font-normal tracking-tight text-gray-800 text-left">
        Unique sessions
      </h2>
      <div class="btn-group">
        <button
          class="btn btn-sm btn-ghost"
          v-for="day in dayOptions"
          :class="{ 'btn-active': day === store.selectedDays }"
          @click="store.selectedDays = day"
        >
          {{ day }} days
        </button>
      </div>
    </div>

    <SessionsOverTime />
    <div class="mt-8"></div>
    <Stats />
    <div class="mt-4"></div>

    <Sessions />
    <div class="mt-4"></div>
    <Referrers />
  </main>
</template>
