<script setup lang="ts">
import { useAdminStore } from "~/stores/admin";
import { DatabaseSize } from "~/types/types";
import { formatBytes } from "~/utils/bytes";

const adminStore = useAdminStore();
const { subscription, subscriptionLoading } = storeToRefs(adminStore);

const { data: dbSize, pending: dbSizeLoading } = await useFetch("/api/admin/database/size");

const usagePercent = computed(() => {
  if (!dbSize.value) return 0;
  const currentSize = parseInt(dbSize.value.sizeBytes);
  const variantId = subscription.value?.attributes.variant_id;
  if (!variantId) return 0;
  const plan = getPlanById(variantId.toString());
  if (!plan?.sizeBytes) return 0;
  const maxSize = plan.sizeBytes;
  return Number((currentSize / maxSize) * 100).toPrecision(2);
});

const usageFormatted = computed(() => {
  if (!dbSize.value) return 0;
  const currentSize = parseInt(dbSize.value.sizeBytes);
  return formatBytes(currentSize);
});

const totalFormatted = computed(() => {
  const variantId = subscription.value?.attributes.variant_id;
  if (!variantId) return 0;
  const plan = getPlanById(variantId.toString());
  if (!plan?.sizeBytes) return 0;
  const maxSize = plan.sizeBytes;
  return formatBytes(maxSize);
});

const freeSpaceFormatted = computed(() => {
  if (!dbSize.value) return 0;
  const currentSize = parseInt(dbSize.value.sizeBytes);
  const variantId = subscription.value?.attributes.variant_id;
  if (!variantId) return 0;
  const plan = getPlanById(variantId.toString());
  if (!plan?.sizeBytes) return 0;
  const maxSize = plan.sizeBytes;
  return formatBytes(maxSize - currentSize);
});
</script>
<template>
  <div class="card lg:card-side bg-base-100 border h-full" v-if="subscription && dbSize">
    <div class="card-body px-6 py-6">
      <h2 class="card-title">Subscription</h2>
      <div class="flex flex-col justify-center">
        <p class="text-xl font-semibold">Free: {{ freeSpaceFormatted }}</p>
        <p class="text-xl mt-1">Used: {{ usageFormatted }}</p>
        <p class="text-xl mt-1">Available: {{ totalFormatted }}</p>
        <p class="text-xl mt-1" v-if="subscription?.attributes.status !== 'active'">
          Status: {{ subscription?.attributes.status_formatted }}
        </p>
      </div>
    </div>
    <figure class="p-8 bg-primary text-white">
      <div
        class="radial-progress"
        :style="`--value: ${usagePercent}`"
        style="--size: 10rem; --thickness: 20px"
        v-if="!dbSizeLoading && !subscriptionLoading"
      >
        {{ usagePercent }}%
      </div>
      <div v-else class="loading loading-spinner loading-lg"></div>
    </figure>
  </div>
</template>
