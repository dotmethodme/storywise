<script setup lang="ts">
import GettingStarted from "@/components/GettingStarted.vue";
import ReferrersAndCountries from "@/components/ReferrersAndCountries.vue";
import SessionsOverTime from "@/components/SessionsOverTime.vue";
import Stats from "@/components/Stats.vue";
import Sessions from "@/components/UniqueSessions.vue";
import { useGlobalStore } from "@/stores/counter";

const store = useGlobalStore();

const dayOptions = [7, 14, 30, 90];
</script>

<template>
  <main class="w-full">
    <div v-if="store.siteConfig?.hasEvents">
      <div class="flex mb-4 mt-4 justify-between lg:flex-row flex-col gap-4">
        <h2 class="text-xl font-normal tracking-tight text-left">
          Unique visitors
        </h2>
        <div class="btn-group">
          <button class="btn btn-sm btn-ghost" v-for="day in dayOptions"
            :class="{ 'btn-active': day === store.selectedDays }" @click="store.selectedDays = day">
            {{ day }} days
          </button>
        </div>
      </div>

      <SessionsOverTime />
      <div class="mt-8"></div>
      <Stats />
      <div class="mt-4"></div>

      <Sessions />
    </div>

    <div v-else>
      <GettingStarted />
    </div>
  </main>
</template>
