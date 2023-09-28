<script lang="ts" setup>
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";

const url = window.location.origin;

const store = useGlobalStore();
const { activeAppId } = storeToRefs(store);
</script>

<template>
  <h2 class="mt-4 text-xl font-bold tracking-tight text-gray-800 text-left">Embed</h2>

  <p class="mt-4 mb-4 text-lg">Simply embed the following code in the head of your website:</p>

  <div class="mockup-code">
    <pre>
    <code>
    &lt;!DOCTYPE html&gt;
    &lt;html lang="en"&gt;
        &lt;head&gt;
            ...
            <code  class="text-green-300">&lt;script defer async src="{{ url }}/js/script.js?app_id={{activeAppId}}"&gt;&lt;/script&gt;</code>
        &lt;/head&gt;
        &lt;body&gt;
            ...
        &lt;/body&gt;
    &lt;/html&gt;</code>
    </pre>
  </div>

  <h2 class="my-8 text-xl font-bold tracking-tight text-gray-800 text-left">Site configuration</h2>
  <div class="w-full">
    <table class="table w-full">
      <!-- head -->
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
