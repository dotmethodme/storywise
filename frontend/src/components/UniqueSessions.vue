<script lang="ts" setup>
import {
  getHitsPerPage,
  getTopReferrers,
  getUniqueSessionsPerPage,
  getUniqueVisitorsByCountry,
} from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import type { HitsPerPage, Referrer, Country } from "@shared/types";
import { computed, onMounted, ref } from "vue";

const sessions = ref<HitsPerPage[]>([]);
const hits = ref<HitsPerPage[]>([]);
const referrers = ref<Referrer[]>([]);
const countries = ref<Country[]>([]);

const store = useGlobalStore();

async function fetchData(days: number) {
  const [sessionData, hitData, referrerData, countryData] = await Promise.all([
    getUniqueSessionsPerPage(days),
    getHitsPerPage(days),
    getTopReferrers(days),
    getUniqueVisitorsByCountry(days),
  ]);
  sessions.value = sessionData;
  hits.value = hitData;
  referrers.value = referrerData;
  countries.value = countryData;
}

const viewLimit = 10;

const visibleHits = computed(() => hits.value.slice(0, viewLimit));
const visibleSessions = computed(() => sessions.value.slice(0, viewLimit));
const visibleReferrers = computed(() => referrers.value.slice(0, viewLimit));
const visibleCountries = computed(() => countries.value.slice(0, viewLimit));

const viewMoreHits = computed(() => hits.value.length > viewLimit);
const viewMoreHitsOn = ref(false);
const viewMoreSessions = computed(() => sessions.value.length > viewLimit);
const viewMoreSessionsOn = ref(false);
const viewMoreReferrers = computed(() => referrers.value.length > viewLimit);
const viewMoreReferrersOn = ref(false);
const viewMoreCountries = computed(() => countries.value.length > viewLimit);
const viewMoreCountriesOn = ref(false);

onMounted(() => fetchData(store.selectedDays));
store.$subscribe((_, { selectedDays }) => fetchData(selectedDays));
</script>
<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Top unique visitors -->
      <div class="card bg-base-100 shadow-lg card-compact mb-4">
        <div class="card-body">
          <table class="table table-compact w-full">
            <tbody>
              <tr>
                <th class="font-bold text-ellipsis overflow-hidden">Top unique visitors</th>
                <th class="font-bold text-right">
                  <span
                    class="link text-accent-content"
                    v-if="viewMoreSessions"
                    @click="() => (viewMoreSessionsOn = !viewMoreSessionsOn)"
                    >More
                  </span>
                </th>
              </tr>

              <tr v-for="session in visibleSessions" :key="session.path">
                <td class="text-ellipsis overflow-hidden" :title="session.path">
                  {{ session.path || "-" }}
                </td>
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

                <tr v-for="session in sessions" :key="session.path">
                  <td class="text-ellipsis overflow-hidden" :title="session.path">
                    {{ session.path || "-" }}
                  </td>
                  <td class="text-right">{{ session.count }}</td>
                </tr>
              </tbody>
            </table>
          </form>
          <form method="dialog" class="modal-backdrop" @click="() => (viewMoreSessionsOn = false)"></form>
        </dialog>
      </div>

      <!-- Top page views -->
      <div class="card bg-base-100 shadow-lg card-compact mb-4">
        <div class="card-body overflow-x-auto">
          <table class="table table-compact w-full">
            <tbody>
              <tr>
                <th class="font-bold">Top page views</th>
                <th class="font-bold text-right">
                  <span
                    class="link text-accent-content"
                    v-if="viewMoreHits"
                    @click="() => (viewMoreHitsOn = !viewMoreHitsOn)"
                  >
                    More
                  </span>
                </th>
              </tr>

              <tr v-for="hit in visibleHits" :key="hit.path">
                <td class="text-ellipsis overflow-hidden" :title="hit.path">
                  {{ hit.path || "-" }}
                </td>
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

    <!-- Top referrers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="card bg-base-100 shadow-lg card-compact">
        <div class="card-body">
          <table class="table table-compact">
            <tbody>
              <tr>
                <th class="font-bold">Top referrers</th>
                <th class="font-bold text-right">
                  <span
                    class="link text-accent-content"
                    v-if="viewMoreReferrers"
                    @click="() => (viewMoreReferrersOn = !viewMoreReferrersOn)"
                  >
                    More
                  </span>
                </th>
              </tr>
              <tr v-for="row in visibleReferrers" :key="row.referrer">
                <td>{{ row.referrer || "-" }}</td>
                <td class="text-right">{{ row.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <dialog class="modal modal-bottom sm:modal-middle" :class="viewMoreReferrersOn ? 'modal-open' : ''">
        <form method="dialog" class="modal-box max-h-max m-auto">
          <table class="table table-compact w-full">
            <tbody>
              <tr>
                <th class="font-bold">Top referrers</th>
                <th class="font-bold text-right"></th>
              </tr>

              <tr v-for="row in referrers" :key="row.referrer">
                <td>{{ row.referrer || "-" }}</td>
                <td class="text-right">{{ row.count }}</td>
              </tr>
            </tbody>
          </table>
        </form>
        <form method="dialog" class="modal-backdrop" @click="() => (viewMoreReferrersOn = false)"></form>
      </dialog>

      <!-- Top countries -->
      <div class="card bg-base-100 shadow-lg card-compact">
        <div class="card-body">
          <table class="table table-compact">
            <tbody>
              <tr>
                <th class="font-bold">Top countries</th>
                <th class="font-bold text-right">
                  <span
                    class="link text-accent-content"
                    v-if="viewMoreCountries"
                    @click="() => (viewMoreCountriesOn = !viewMoreCountriesOn)"
                  >
                    More
                  </span>
                </th>
              </tr>
              <tr v-for="row in visibleCountries" :key="row.country">
                <td>{{ row.country || "-" }}</td>
                <td class="text-right">{{ row.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <dialog class="modal modal-bottom sm:modal-middle" :class="viewMoreCountriesOn ? 'modal-open' : ''">
        <form method="dialog" class="modal-box max-h-max m-auto">
          <table class="table table-compact w-full">
            <tbody>
              <tr>
                <th class="font-bold">Top countries</th>
                <th class="font-bold text-right"></th>
              </tr>

              <tr v-for="row in countries" :key="row.country">
                <td>{{ row.country || "-" }}</td>
                <td class="text-right">{{ row.count }}</td>
              </tr>
            </tbody>
          </table>
        </form>
        <form method="dialog" class="modal-backdrop" @click="() => (viewMoreCountriesOn = false)"></form>
      </dialog>
    </div>
  </div>
</template>

<style scoped>
.table {
  table-layout: fixed;
}

th:first-child,
td:first-child {
  width: 90%;
}

th:last-child,
td:last-child {
  width: 10%;
}
</style>
