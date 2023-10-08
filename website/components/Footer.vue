<template>
  <footer class="footer pt-10 pb-20 bg-neutral text-neutral-content px-8 sm:px-10">
    <div class="max-w-6xl">
      <NuxtLink
        href="/"
        class="normal-case font-normal text-3xl serif text-base-100 dark:text-accent-content"
      >
        storywise.
      </NuxtLink>
      <p class="mt-8">
        Brought to you by
        <NuxtLink class="link" href="https://dotmethod.me" target="_blank"> dotmethod.me </NuxtLink>
        <br />
        Maximizing your business success with technology
      </p>
    </div>
    <div>
      <span class="footer-title">Useful links</span>
      <NuxtLink class="link link-hover" href="/">Home</NuxtLink>
      <NuxtLink class="link link-hover" href="/contact">Contact</NuxtLink>
      <NuxtLink class="link link-hover" href="/docs">Documentation</NuxtLink>
      <NuxtLink class="link link-hover" href="/privacy">Privacy</NuxtLink>
      <NuxtLink class="link link-hover" href="/data-policy">Data policy</NuxtLink>
      <NuxtLink class="link link-hover" href="/cookies">Cookie policy</NuxtLink>
    </div>
    <div>
      <span class="footer-title">Resources</span>

      <NuxtLink class="link link-hover" href="https://demo.joinstorywise.com/admin/" target="_blank">
        Demo
      </NuxtLink>

      <NuxtLink class="link link-hover" href="https://github.com/dotmethodme/storywise" target="_blank">
        Github
      </NuxtLink>

      <NuxtLink class="link link-hover" href="https://discord.gg/vuWTHEGB2y" target="_blank">
        Discord
      </NuxtLink>

      <NuxtLink
        class="link link-hover"
        href="https://hub.docker.com/r/mihainueleanu/storywise"
        target="_blank"
      >
        Dockerhub
      </NuxtLink>
    </div>
    <div></div>
    <div></div>
  </footer>
</template>
