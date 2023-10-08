<script setup lang="ts">
const showModal = ref(false);
</script>
<template>
  <div class="hero min-h-full bg-base-100 overflow-hidden">
    <div class="hero-content flex-col lg:flex-row max-w-screen-xl lg:px-6 w-full">
      <div class="flex-1 lg:pr-10">
        <h1 class="text-5xl font-bold serif tracking-tight">Simple analytics</h1>
        <p class="py-6 text-xl max-w-xl">
          Simple, open-source, privacy-friendly analytics for your website and for your apps. Multi-database
          support. Easy to self-host or use our upcoming cloud service.
        </p>
        <a class="btn btn-primary mr-2" href="#sign-up">
          <Icon name="mdi:heart" size="2em" class="mr-1" />
          Sign Up
        </a>

        <a class="btn btn-ghost mr-2" href="https://discord.gg/vuWTHEGB2y" target="_blank">
          <Icon name="ic:baseline-discord" size="2em" class="mr-1" />
          Discord
        </a>
        <a class="btn btn-ghost" href="https://demo.joinstorywise.com/admin">
          <Icon name="material-symbols:rocket" size="2em" class="mr-1" />
          Demo
        </a>
      </div>

      <!-- Browser -->
      <div class="max-w-2xl mx-auto my-10 rounded-lg overflow-hidden shadow-xl w-full">
        <div class="w-full h-11 bg-base-300 dark:bg-base-300 flex justify-between items-center">
          <div class="flex justify-start space-x-1.5 px-3 items-center">
            <span class="w-3 h-3 rounded-full bg-red-400"></span>
            <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span class="w-3 h-3 rounded-full bg-green-400"></span>
          </div>

          <div class="opacity-30 dark:opacity-50 text-xs select-none">demo.joinstorywise.com</div>
          <div class="w-20"></div>
        </div>
        <div class="bg-gray-100 border-t-0 w-full lg:h-96 relative">
          <video muted autoplay loop width="500" class="object-cover h-full w-full z-2">
            <source src="/video/demo.webm" type="video/webm" />
          </video>
          <!-- <img src="/video/demo-fallback.webp" class="z-1 absolute w-full h-full top-0" /> -->
        </div>
      </div>
    </div>
  </div>
</template>
