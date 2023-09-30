<script lang="ts" setup>
import CodePreview from "@/components/CodePreview.vue";
import { useGlobalStore } from "@/stores/global";

const store = useGlobalStore();
</script>

<template>
  <h2 class="mt-4 text-xl font-bold tracking-tight text-gray-800 text-left">Embed</h2>
  <p class="mt-4 mb-4 text-lg">Simply embed the following code in the head of your website:</p>
  <CodePreview />

  <h2 class="my-8 text-xl font-bold tracking-tight text-gray-800 text-left">Site configuration</h2>
  <div class="w-full">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>API_BASE_URL</td>
          <td>{{ store.siteConfig?.apiBaseUrl }}</td>
        </tr>
        <tr>
          <td>ALLOWED_ORIGIN</td>
          <td>{{ store.siteConfig?.allowedOrigin }}</td>
        </tr>
      </tbody>
    </table>

    <div class="my-20"></div>
  </div>
</template>
