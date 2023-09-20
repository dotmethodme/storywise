<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  rows: { key: string; value: number }[];
  title: string;
  viewLimit?: number;
}>();

const viewLimit = props.viewLimit || 10;

const countsVisible = computed(() => props.rows.slice(0, viewLimit));
const showViewMore = computed(() => props.rows.length > viewLimit);
const viewingMore = ref(false);
</script>

<template>
  <div class="card bg-base-100 shadow card-compact">
    <div class="card-body">
      <table class="table table-compact">
        <tbody>
          <tr>
            <th class="font-bold">{{ title }}</th>
            <th class="font-bold text-right">
              <span
                class="link text-accent-content"
                v-if="showViewMore"
                @click="() => (viewingMore = !viewingMore)"
              >
                More
              </span>
            </th>
          </tr>
          <tr v-for="row in countsVisible" :key="row.key">
            <td>{{ row.key || "-" }}</td>
            <td class="text-right">{{ row.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <dialog class="modal modal-bottom sm:modal-middle" :class="viewingMore ? 'modal-open' : ''">
    <form method="dialog" class="modal-box max-h-max m-auto">
      <table class="table table-compact w-full">
        <tbody>
          <tr>
            <th class="font-bold">Operating system</th>
            <th class="font-bold text-right"></th>
          </tr>

          <tr v-for="row in rows" :key="row.key">
            <td :title="row.key.toString()">{{ row.key || "-" }}</td>
            <td class="text-right">{{ row.value }}</td>
          </tr>
        </tbody>
      </table>
    </form>
    <form method="dialog" class="modal-backdrop" @click="() => (viewingMore = false)"></form>
  </dialog>
</template>

<style scoped>
.table {
  table-layout: fixed;
  width: 100%;
}

th:first-child,
td:first-child {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
}

th:last-child,
td:last-child {
  width: 10%;
}
</style>
