<script lang="ts" setup>
import { getHitsPerPage, getUniqueSessionsPerPage } from "@/service/data";
import type { HitsPerPage } from "@/service/types";
import { useGlobalStore } from "@/stores/counter";
import { computed, onMounted, ref } from "vue";

const sessions = ref<HitsPerPage[]>([]);
const hits = ref<HitsPerPage[]>([]);
const store = useGlobalStore();

async function fetchData(days: number) {
  const [sessionData, hitData] = await Promise.all([
    getUniqueSessionsPerPage(days),
    getHitsPerPage(days),
  ]);
  sessions.value = sessionData;
  hits.value = hitData;
}

const viewLimit = 10;
const visibleHits = computed(() => hits.value.slice(0, viewLimit));
const visibleSessions = computed(() => sessions.value.slice(0, viewLimit));
const viewMoreHits = computed(() => hits.value.length > viewLimit);
const viewMoreHitsOn = ref(false);
const viewMoreSessions = computed(() => sessions.value.length > viewLimit);
const viewMoreSessionsOn = ref(false);

onMounted(() => fetchData(store.selectedDays));
store.$subscribe((_, { selectedDays }) => fetchData(selectedDays));
</script>
<template>
  <div>
    <div class="columns-1 md:columns-2 gap-4 justify-between justify-items-center">
      <div class="card bg-base-100 shadow-lg card-compact mb-4">
        <div class="card-body">
          <table class="table table-compact w-full">
            <tbody>
              <tr>
                <th class="font-bold text-ellipsis">Top unique visitors</th>
                <th class="font-bold text-right">
                  <span class="link text-accent-content" v-if="viewMoreSessions"
                    @click="() => (viewMoreSessionsOn = !viewMoreSessionsOn)">More
                  </span>
                </th>
              </tr>
              <!-- row 1 -->
              <tr v-for="session in visibleSessions" :key="session.path">
                <td class="text-ellipsis">{{ session.path || "-" }}</td>
                <td class="text-right">{{ session.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <dialog class="modal modal-bottom sm:modal-middle" :class="viewMoreSessionsOn ? 'modal-open' : ''">
          <form method="dialog" class="modal-box max-h-max m-auto">
            <table class="table table-compact w-full">
              <tbody>
                <tr>
                  <th class="font-bold">Top unique visitors</th>
                  <th class="font-bold text-right"></th>
                </tr>
                <!-- row 1 -->
                <tr v-for="session in sessions" :key="session.path">
                  <td class="text-ellipsis">{{ session.path || "-" }}</td>
                  <td class="text-right">{{ session.count }}</td>
                </tr>
              </tbody>
            </table>
          </form>
          <form method="dialog" class="modal-backdrop" @click="() => (viewMoreSessionsOn = false)"></form>
        </dialog>
      </div>

      <div class="card bg-base-100 shadow-lg card-compact mb-4">
        <div class="card-body overflow-x-auto">
          <table class="table table-compact w-full">
            <tbody>
              <tr>
                <th class="font-bold">Top page views</th>
                <th class="font-bold text-right">
                  <span class="link text-accent-content" v-if="viewMoreHits"
                    @click="() => (viewMoreHitsOn = !viewMoreHitsOn)">
                    More
                  </span>
                </th>
              </tr>
              <!-- row 1 -->
              <tr v-for="hit in visibleHits" :key="hit.path">
                <td class="text-ellipsis">{{ hit.path || "-" }}</td>
                <td class="text-right">{{ hit.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <dialog class="modal modal-bottom sm:modal-middle" :class="viewMoreHitsOn ? 'modal-open' : ''">
          <form method="dialog" class="modal-box max-h-max m-auto">
            <table class="table table-compact w-full">
              <tbody>
                <tr>
                  <th class="font-bold">Top page views</th>
                  <th class="font-bold text-right"></th>
                </tr>
                <!-- row 1 -->
                <tr v-for="session in hits" :key="session.path">
                  <td>{{ session.path || "-" }}</td>
                  <td class="text-right">{{ session.count }}</td>
                </tr>
              </tbody>
            </table>
          </form>
          <form method="dialog" class="modal-backdrop" @click="() => (viewMoreHitsOn = false)"></form>
        </dialog>
      </div>
    </div>
  </div>
</template>

<style></style>
