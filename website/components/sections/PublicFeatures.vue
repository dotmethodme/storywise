<script setup lang="ts">
const features = [
  {
    title: "Simple",
    description:
      "Did I mention \"simple\"? Yes, think I did already. But damn, that's the best part - it's simple. It's easy to use. It's easy to setup. It's easy to understand. It's easy to love.",
  },
  {
    title: "Lightweight",
    description: "Built on nimble technologies, storywise is lightweight and fast.",
  },
  {
    title: "Export & import your data",
    description:
      "The data is yours. You can export and import your data at any time, which makes storywise easy to backup and extremely portable.",
  },
  {
    title: "Privacy under your control",
    description:
      "You get to choose where you want to store your data. And you get to choose how you integrate storywise into your apps: cookie/no-cookie, it's up to you.",
  },
  {
    title: "Less is more",
    description:
      "Sure, storywise is flexible. But not overly-flexible. And it's by design - simplicity is key for any new features we add. We want to keep it simple.",
  },
  {
    title: "Open to contributions",
    description:
      "Missing a feature? Storywise welcomes community contributions. We're open to pull requests and feature requests.",
  },
];
</script>
<template>
  <div class="bg-base-100 py-20 px-4 sm:px-8 mb-20">
    <h1 class="text-4xl font-bold tracking-tight text-center mb-4">Why storywise?</h1>
    <p class="text-center text-lg mb-10 opacity-50">
      Do we really need a new analytics tool? Short answer - <b>YES!</b>
    </p>

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
