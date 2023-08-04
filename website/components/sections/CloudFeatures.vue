<script setup lang="ts">
const features = [
  {
    title: "Simple pricing",
    description:
      "We pay for storage, so you pay for storage, which makes our interests aligned. It also makes it more simple to reason about.",
  },
  {
    title: "Own your data",
    description:
      "You own your data. You're free to export it at any time and move it to your own self-hosted infrastructure if you'd like.",
  },
  {
    title: "Open source",
    description:
      "You'll get exactly the same product and features as the open-source project. Everything is transparent to everyone.",
  },
  {
    title: "Privacy friendly",
    description:
      "If you care about your user's privacy, storywise has your back. We track users anonymously by default and host on European cloud providers only.",
  },
  {
    title: "No hosting or scaling worries",
    description:
      "We take care of hosting and scaling for you. You can focus on building your product and we'll make sure it scales with you.",
  },
  {
    title: "No vendor lock-in",
    description:
      "You can export your data at any time and move it to your own self-hosted infrastructure if you'd like.",
  },
];
</script>
<template>
  <div class="bg-base-100 py-20 px-4 sm:px-8">
    <div class="max-w-6xl m-auto justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="flex flex-col pl-8" v-for="item in features">
        <h2 class="text-xl mb-2 relative">
          <Icon size="1.3em" name="ic:round-check" class="text-green-600 absolute -left-10" />
          {{ item.title }}
        </h2>
        <p class="mb-4 opacity-50">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>
