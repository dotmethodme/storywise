<script setup lang="ts">
import Sessions from "@/components/UniqueSessions.vue";
import SessionsOverTime from "@/components/SessionsOverTime.vue";
import Referrers from "@/components/Referrers.vue";
import { useGlobalStore } from "@/stores/counter";

const store = useGlobalStore();

const dayOptions = [7, 14, 30, 90];
</script>

<template>
  <main class="w-full">
    <h1 class="mb-5 text-2xl font-extrabold tracking-tight text-gray-900">
      Storywise / <span class="text-gray-500">analytics made simple</span>
    </h1>

    <div class="btn-group mb-10">
      <button
        class="btn btn-sm btn-ghost"
        v-for="day in dayOptions"
        :class="{ 'btn-active': day === store.selectedDays }"
        @click="store.selectedDays = day"
      >
        {{ day }} days
      </button>
    </div>
    <SessionsOverTime />
    <div class="mt-8"></div>
    <Sessions />
    <div class="mt-4"></div>
    <Referrers />
  </main>
</template>
