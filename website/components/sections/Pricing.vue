<script lang="ts" setup>
const plans = [
  {
    size: "0.5GB storage",
    price: "$10",
    events: "(819,200 events, approx.)",
  },
  {
    size: "1GB storage",
    price: "$19",
    events: "(1,638,400 events, approx.)",
  },
  {
    size: "2GB storage",
    price: "$36",
    events: "(3,276,800 events, approx.)",
  },
  {
    size: "3GB storage",
    price: "$54",
    events: "(4,915,200 events, approx.)",
  },
  {
    size: "4GB storage",
    price: "$70.4",
    events: "(6,553,600 events, approx.)",
  },
  {
    size: "5GB storage",
    price: "$85",
    events: "(8,192,000 events, approx.)",
  },
  {
    size: "6GB storage",
    price: "$102",
    events: "(9,830,400 events, approx.)",
  },
  {
    size: "Contact us",
    price: "Let's find out",
    events: "Super duper pro",
  },
];

const plansYearlyWithDiscount = [
  {
    size: "0.5GB storage",
    price: "$108",
    events: "(819,200 events, approx.)",
  },
  {
    size: "1GB storage",
    price: "$205.2",
    events: "(1,638,400 events, approx.)",
  },
  {
    size: "2GB storage",
    price: "$367.2",
    events: "(3,276,800 events, approx.)",
  },
  {
    size: "3GB storage",
    price: "$550.8",
    events: "(4,915,200 events, approx.)",
  },
  {
    size: "4GB storage",
    price: "$718.08",
    events: "(6,553,600 events, approx.)",
  },
  {
    size: "5GB storage",
    price: "$867",
    events: "(8,192,000 events, approx.)",
  },
  {
    size: "6GB storage",
    price: "$1040.4",
    events: "(9,830,400 events, approx.)",
  },
  {
    size: "Contact us",
    price: "Let's find out",
    events: "Super duper pro",
  },
];

const slider = ref(0);
const yearly = ref(false);

const plan = computed(() => (yearly.value ? plansYearlyWithDiscount[slider.value] : plans[slider.value]));
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
          <div class="flex flex-row items-center">
            <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
            <p class="ml-2">10 projects</p>
          </div>
          <div class="flex flex-row items-center">
            <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
            <p class="ml-2">Full data ownership</p>
          </div>
          <div class="flex flex-row items-center">
            <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
            <p class="ml-2">1 server per project</p>
          </div>
          <div class="flex flex-row items-center">
            <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
            <p class="ml-2">1 database per project</p>
          </div>
          <div class="flex flex-row items-center">
            <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
            <p class="ml-2">Access to support</p>
          </div>
          <div class="flex flex-row items-center">
            <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
            <p class="ml-2">Archive old data</p>
          </div>
        </div>

        <div class="flex justify-center mt-10">
          <a class="btn btn-primary m-auto" href="#sign-up">
            Join now
            <Icon name="charm:rocket" class="" size="1.4em" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
