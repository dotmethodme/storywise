<script lang="ts" setup>
const plans = [
  {
    size: "0.5GB",
    price: 10,
    events: "819,200",
  },
  {
    size: "1GB",
    price: 19,
    events: "1,638,400",
  },
  {
    size: "2GB",
    price: 36,
    events: "3,276,800",
  },
  {
    size: "3GB",
    price: 54,
    events: "4,915,200",
  },
  {
    size: "4GB",
    price: 70.4,
    events: "6,553,600",
  },
  {
    size: "5GB",
    price: 85,
    events: "8,192,000",
  },
  {
    size: "6GB",
    price: 102,
    events: "9,830,400",
  },
  {
    size: "Contact us",
  },
];

const plansYearlyWithDiscount = [
  {
    size: "0.5GB",
    price: 108,
    events: "819,200",
  },
  {
    size: "1GB",
    price: 205.2,
    events: "1,638,400",
  },
  {
    size: "2GB",
    price: 367.2,
    events: "3,276,800",
  },
  {
    size: "3GB",
    price: 550.8,
    events: "4,915,200",
  },
  {
    size: "4GB",
    price: 718.08,
    events: "6,553,600",
  },
  {
    size: "5GB",
    price: 867,
    events: "8,192,000",
  },
  {
    size: "6GB",
    price: 1040.4,
    events: "9,830,400",
  },
  {
    size: "Contact us",
  },
];

const slider = ref(0);
const yearly = ref(false);

const plan = computed(() => (yearly.value ? plansYearlyWithDiscount[slider.value] : plans[slider.value]));
</script>

<template>
  <div class="px-4 py-8 max-w-screen-xl m-auto flex-col lg:flex-row flex justify-center gap-4">
    <div class="flex flex-col flex-1 align-center justify-center m-0 lg:m-auto">
      <h1 class="serif text-5xl mb-4 font-bold tracking-tight">The storywise cloud</h1>
      <p class="sans text-xl">
        A simple and robust architecture where storywise does all the work, but you're in control.
      </p>
      <ul class="text-xl mt-4">
        <li class="mb-2">
          <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
          <span class="ml-4">Simple to manage</span>
        </li>
        <li class="mb-2">
          <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
          <span class="ml-4">Fair pricing based on storage</span>
        </li>
        <li class="mb-2">
          <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
          <span class="ml-4">Your own dedicated & scalable infrastructure</span>
        </li>
      </ul>
    </div>

    <div class="max-w-2xl m-auto">
      <img src="/assets/images/cloud-infra.png" alt="Architecture of storywise cloud" />
    </div>
  </div>

  <div id="pricing" class="bg-base-100 py-20 px-4 sm:px-8 mb-20">
    <div class="max-w-3xl m-auto flex flex-col justify-center items-center">
      <h1 class="text-center text-4xl sans tracking-tight font-bold">The simplest, fairest pricing</h1>
      <p class="mt-4 text-2xl text-center max-w-xl">
        We pay for storage, you pay for storage. Our interests are aligned and it's only fair.
      </p>

      <div class="w-full max-w-2xl mt-10">
        <div class="flex justify-between">
          <div class="text-left">
            <p class="text-xl">
              <span class="text-3xl">{{ plan.size }}</span> storage
            </p>
            <p class="mb-4 opacity-50 tracking-tight">
              <span class="">{{ plan.events }}</span> events
            </p>
          </div>
          <div class="text-right">
            <p class="text-xl">
              <span class="text-3xl">${{ plan.price }}</span>
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
          class="range range-info w-full z-1 mt-2"
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
      </div>
    </div>
  </div>

  <Waitlist />
</template>
