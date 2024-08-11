<script setup lang="ts">
import House from "@/components/icons/House.vue";
import Info from "@/components/icons/Info.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div class="text-right">
    <ul class="menu md:menu-horizontal rounded-xl p-0">
      <li class="rounded-xl">
        <a :href="`#/${route.params.appId}`">
          <House />
        </a>
      </li>
      <li class="rounded-xl">
        <a :href="`#/${route.params.appId}/about`">
          <Info />
          Options
        </a>
      </li>
    </ul>
  </div>
</template>
