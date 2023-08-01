<script lang="ts" setup></script>

<template>
  <div
    class="px-4 py-8 max-w-screen-xl m-auto grid grid-cols-2 justify-center gap-4"
  >
    <div class="flex flex-col flex-1 align-center justify-center">
      <h1 class="serif text-4xl mb-4 font-bold">The storywise cloud</h1>
      <p class="sans text-xl max-w-lg">
        A simple and robust architecture where storywise does all the work, but
        you're in control.
      </p>
    </div>

    <div class="max-w-xl">
      <img
        src="/assets/images/cloud-infra.png"
        alt="Architecture of storywise cloud"
      />
    </div>
  </div>

  <Waitlist />
</template>
