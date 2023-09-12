<script lang="ts" setup>
import { getPlanById } from "~/utils/products";

// layout
defineAppConfig({
  layout: "docs",
});

const router = useRouter();
const route = useRoute();
const variantId = ref(route.query.variantId as string);

const plan = computed(() => {
  if (!variantId.value) return null;
  return getPlanById(variantId.value);
});

onMounted(() => {
  if (!route.query.variantId) {
    router.push("/cloud");
  }
});
</script>
<template>
  <div>
    <h1>Onboarding</h1>
    <p>This is the onboarding page for variant {{ plan }}.</p>
  </div>
</template>
