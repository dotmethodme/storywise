<script lang="ts" setup>
definePageMeta({
  layout: false,
});
</script>

<template>
  <NuxtLayout name="docs">
    <template #sidebar>
      <ul class="menu p-4 w-80 h-full bg-base-100 text-accent-content border-r-2 border-base-200">
        <!-- Sidebar content here -->
        <li><a href="#getting-started">Getting started</a></li>
        <li><a href="#deploy-in-the-cloud-free">Deploy in the cloud (free*)</a></li>
        <li><a href="#resources">Resources</a></li>
        <li><a href="#environment-variables">Environment variables</a></li>
        <li><a href="#deploy-on-docker-compose">Deploy on docker-compose</a></li>
        <li><a href="#deploy-on-kubernetes">Deploy on Kubernetes</a></li>
        <li><a href="#embed">Embed</a></li>
        <li><a href="#contributions">Contributions</a></li>
        <li><a href="#tech-stack">Tech stack</a></li>
      </ul>
    </template>

    <div class="prose prose-stone py-8 px-8 lg:px-16 max-w-4xl m-auto ">
      <ContentDoc />
    </div>

  </NuxtLayout>
</template>

<style>
.prose a {
  word-wrap: break-word;
  word-break: break-all;
}

.prose h2 a {
  text-decoration: none;
}
</style>
