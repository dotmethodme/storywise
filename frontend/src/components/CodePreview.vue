<script lang="ts" setup>
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";

const store = useGlobalStore();
const { activeAppId } = storeToRefs(store);

const url = window.location.origin;
</script>

<template>
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
</template>
