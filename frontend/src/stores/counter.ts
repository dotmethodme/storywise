import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", () => {
  const selectedDays = ref(30);

  return { selectedDays };
});
