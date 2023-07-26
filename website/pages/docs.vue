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
        <li>
          <NuxtLink href="#getting-started">Getting started</NuxtLink>
        </li>
        <li>
          <NuxtLink href="#deploy-in-the-cloud-free">Deploy in the cloud (free*)</NuxtLink>
        </li>
        <li>
          <NuxtLink href="#resources">Resources</NuxtLink>
        </li>
        <li>
          <NuxtLink href="#environment-variables">Environment variables</NuxtLink>
        </li>
        <li>
          <NuxtLink href="#deploy-on-docker-compose">Deploy on docker-compose</NuxtLink>
        </li>
        <li>
          <NuxtLink href="#deploy-on-kubernetes-helm">Deploy on Kubernetes (helm)</NuxtLink>
        </li>
        <li>
          <NuxtLink href="#deploy-on-kubernetes-yaml">Deploy on Kubernetes (yaml)</NuxtLink>
        </li>
        <li>
          <NuxtLink href="#embed">Embed</NuxtLink>
        </li>
        <li>
          <NuxtLink href="#contributions">Contributions</NuxtLink>
        </li>
        <li>
          <NuxtLink href="#tech-stack">Tech stack</NuxtLink>
        </li>
      </ul>
    </template>

  <div class="prose prose-stone py-8 px-8 lg:px-16 max-w-4xl m-auto ">
    <ContentDoc />
  </div>

</NuxtLayout></template>

<style>.prose a {
  word-wrap: break-word;
  word-break: break-all;
}

.prose h2 a {
  text-decoration: none;
}</style>
