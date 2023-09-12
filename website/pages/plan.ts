import { variantId } from "./onboarding.vue";

const plan = computed(() => getPlanById(variantId.value));
