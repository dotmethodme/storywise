<script lang="ts" setup>
import { useAdminStore } from "~/stores/admin";
import { DateTime } from "luxon";
import { SubscriptionInvoice } from "~/server/api/webhook/ls.post";

definePageMeta({
  layout: "admin",
});

const adminStore = useAdminStore();
const { subscription, subscriptionLoading } = storeToRefs(adminStore);

const product = computed(() => {
  if (!subscription?.value?.attributes.variant_id) {
    return null;
  }
  return getPlanById(subscription.value.attributes.variant_id.toString());
});

function formatDate(date: string | Date) {
  return DateTime.fromISO(date.toString()).toLocaleString();
}

const payment = computed(
  () =>
    // @ts-ignore
    `${subscription.value?.attributes.card_brand} ending in ${subscription.value?.attributes.card_last_four}`
);

async function cancelSubscription() {
  await useFetch(`/api/admin/subscription`, {
    method: "delete",
  });
  adminStore.fetchSubscription();
}

const invoices = useFetch<SubscriptionInvoice[]>("/api/admin/subscription/invoices");

const showPricing = computed(() => {
  if (subscriptionLoading.value) return false;
  if (subscription.value && subscription.value.attributes.status === "active") return false;
  return true;
});
</script>
<template>
  <h1 class="serif font-bold text-3xl mb-8">Subscription</h1>

  <span v-if="subscriptionLoading" class="loading loading-spinner loading-sm"></span>

  <div v-if="subscription" class="border px-8 py-6 rounded-lg">
    <h2 class="serif text-xl font-semibold mb-4">
      {{ subscription.attributes.variant_name }}
    </h2>
    <div class="mb-1">
      Subscription Status - <b>{{ subscription.attributes.status_formatted }}</b>
    </div>
    <div class="mb-1">Payment Method - {{ payment }}</div>
    <div class="mb-1">Renewal Date - {{ formatDate(subscription.attributes.renews_at) }}</div>
    <div class="mb-1">Created Date - {{ formatDate(subscription.attributes.created_at) }}</div>
    <div class="mb-1">Price - {{ product?.price }} (excluding tax)</div>

    <button
      class="btn btn-primary mt-4"
      @click="cancelSubscription"
      v-if="subscription.attributes.status === 'active'"
    >
      Cancel Subscription
    </button>

    <a
      class="btn btn-primary mt-4"
      :href="subscription.attributes.urls.update_payment_method"
      target="_blank"
      v-if="subscription.attributes.status === 'active'"
    >
      Update Payment Method
    </a>
  </div>

  <div
    v-if="!invoices.pending.value && invoices.data"
    class="border border-b-0 overflow-hidden rounded-lg mt-4"
  >
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>Invoice id</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Created at</th>
            <th>Url</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in invoices.data.value">
            <td>{{ row.id }}</td>
            <td>{{ row.attributes.status_formatted }}</td>
            <td>{{ row.attributes.total_formatted }}</td>
            <td>{{ formatDate(row.attributes.created_at) }}</td>
            <td>
              <a :href="row.attributes.urls.invoice_url" target="_blank" class="link"> View </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="showPricing" class="border rounded-lg mt-4 py-8">
    <PricingSimple />
  </div>
</template>
