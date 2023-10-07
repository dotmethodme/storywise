<script lang="ts" setup>
const slider = ref(0);
const yearly = ref(false);

const { annualPlans, monthlyPlans } = usePlans();

const plan = computed(() => (yearly.value ? annualPlans[slider.value] : monthlyPlans[slider.value]));
const benefits = [
  "Full data ownership",
  "No setup effort",
  "Export/Import data",
  "Your own database",
  "Your own infrastructure",
  "Access to support",
  "Archive old data",
  "As many events as fit in the storage",
];

const route = useRoute();

const shouldAllowSignup = computed(() => {
  return route.query.signup === "true";
});

const signupLink = computed(() => {
  if (shouldAllowSignup.value) {
    return `/onboarding?variantId=${plan.value.variantId}`;
  }
  return `#sign-up`;
});
</script>

<template>
  <div id="pricing" class="bg-base-100 py-20 px-4 sm:px-8 mb-20">
    <div class="max-w-3xl m-auto flex flex-col justify-center items-center">
      <h1 class="text-center text-4xl sans tracking-tight font-bold">The simplest, fairest pricing</h1>
      <p class="mt-4 text-2xl text-center max-w-xl">
        We pay for storage, so you pay for storage. Our interests are aligned and it's only fair.
      </p>

      <div class="w-full max-w-2xl mt-10">
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

        <h1 class="mt-10 font-bold mb-2">What'll you get:</h1>

        <div class="grid grid-cols-2">
          <div class="flex flex-row items-center" v-for="benefit in benefits">
            <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
            <p class="ml-2">{{ benefit }}</p>
          </div>
        </div>

        <template v-if="plan.variantId">
          <div class="flex justify-center mt-10">
            <a class="btn btn-primary m-auto" :href="signupLink">
              Join now
              <Icon name="charm:rocket" class="" size="1.4em" />
            </a>
          </div>
        </template>

        <div class="flex justify-center mt-10" v-else>
          <span class="mr-2">Drop us a message at</span>
          <a href="mailto:hey@joinstorywise.com" class="link"> hey@joinstorywise.com</a>
        </div>
      </div>
    </div>
  </div>
</template>
~/utils/plans
