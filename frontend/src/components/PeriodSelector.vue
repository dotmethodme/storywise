<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

const store = useGlobalStore();

const dayOptions = [7, 14, 30, 90, 120, 365];
</script>

<template>
  <div class="btn-group flex gap-1">
    <button
      class="btn btn-sm btn-ghost"
      v-for="day in dayOptions"
      :class="{ 'btn-active': day === store.selectedDays }"
      @click="store.selectedDays = day"
    >
      {{ day }} days
    </button>
  </div>
</template>
