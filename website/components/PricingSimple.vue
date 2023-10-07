<script setup lang="ts">
import { useAdminStore } from "~/stores/admin";

const adminStore = useAdminStore();
const { user } = storeToRefs(adminStore);

const slider = ref(0);
const yearly = ref(false);

const { annualPlans, monthlyPlans, generateUrlByVariantId } = usePlans();

const plan = computed(() => (yearly.value ? annualPlans[slider.value] : monthlyPlans[slider.value]));

const url = computed(() => {
  if (!plan.value.variantId || !user.value) return;
  const { email, id } = user.value.profile;
  return generateUrlByVariantId(plan.value.variantId, email, id);
});
</script>

<template>
  <div class="w-full max-w-2xl m-auto">
    <p class="mb-4 text-3xl tracking-tight text-center">
      Create a new subscription and start using storywise
    </p>

    <div class="flex justify-between">
      <div class="text-left">
        <p class="text-xl">
          <span class="text-3xl">{{ plan.size }}</span>
        </p>
        <p class="mb-4 opacity-50 tracking-tight">
          {{ plan.events }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-xl">
          <span class="text-3xl">{{ plan.price }}</span>
        </p>
        <p class="mb-4 opacity-50 tracking-tight">your price</p>
      </div>
    </div>

    <input
      type="range"
      min="0"
      max="7"
      v-model="slider"
      step="1"
      class="range range-primary w-full z-1 mt-2"
    />

    <div class="mt-4 flex justify-center items-center">
      <label class="mr-4">Monthly</label>
      <input type="checkbox" class="toggle" v-model="yearly" />
      <label class="ml-4">Yearly</label>
    </div>

    <div class="flex justify-center mt-10" v-if="url">
      <a class="btn btn-primary m-auto" :href="url">
        Create a new subscription
        <Icon name="charm:rocket" class="" size="1.4em" />
      </a>
    </div>
    <div class="flex justify-center mt-10" v-else>
      <span class="mr-2">Drop us a message at</span>
      <a href="mailto:hey@joinstorywise.com" class="link"> hey@joinstorywise.com</a>
    </div>
  </div>
</template>
