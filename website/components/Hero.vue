<script setup lang="ts">
const showModal = ref(false);
</script>
<template>
  <div class="hero min-h-full bg-base-100 overflow-hidden">
    <div class="hero-content flex-col lg:flex-row-reverse max-w-screen-xl lg:px-6 w-full">
      <img src="/intro.png" class="lg:max-w-lg py-10 flex-1 hidden lg:block" />
      <div class="flex-1">
        <h1 class="text-5xl font-bold serif tracking-tight">Simple analytics</h1>
        <p class="py-6 text-xl max-w-xl">
          Simple, open-source, privacy-friendly analytics for your website and for your apps. Self-host or use
          our upcoming cloud service. Built in Europe, with love.
        </p>
        <a class="btn btn-primary mr-2" href="#sign-up">
          <Icon name="mdi:heart" size="2em" class="mr-1" />
          Sign Up
        </a>

        <a class="btn btn-ghost mr-2" href="https://discord.gg/vuWTHEGB2y" target="_blank">
          <Icon name="ic:baseline-discord" size="2em" class="mr-1" />
          Discord
        </a>
        <button class="btn btn-ghost" @click="showModal = true">
          <Icon name="material-symbols:rocket" size="2em" class="mr-1" />
          Demo
        </button>

        <dialog
          class="modal"
          :class="{
            'modal-open': showModal,
          }"
        >
          <form method="dialog" class="modal-box">
            <h3 class="font-bold text-lg">Use the following credentials:</h3>
            <p class="py-4">
              Username: admin <br />
              Password: 123 <br />
            </p>
            <p class="py-4">Best viewed on desktop for the time being</p>
            <p>
              <a class="btn btn-primary w-full" href="https://demo.joinstorywise.com/admin" target="_blank">
                Launch demo
              </a>
            </p>
          </form>
          <form method="dialog" class="modal-backdrop" @click="showModal = false"></form>
        </dialog>
      </div>
    </div>
  </div>
</template>
