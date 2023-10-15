<script lang="ts" setup>
import {
  getHitsPerPage,
  getTopReferrers,
  getUniqueSessionsPerPage,
  getUniqueVisitorsByCountry,
  getSessionCountByUserAgent,
  getSessionCountByUtmTag,
} from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import { countryMap } from "@/utils/countries";
import type { CountByCountry, CountByKeyValue, CountByReferrer, CountHitsPerPage } from "@shared/types";
import { computed, onMounted, ref, watch } from "vue";
import TableBlock from "./TableBlock.vue";
import { storeToRefs } from "pinia";

const store = useGlobalStore();
const { activeAppId, selectedDays } = storeToRefs(store);

const sessions = ref<CountHitsPerPage[]>([]);
const hits = ref<CountHitsPerPage[]>([]);
const referrers = ref<CountByReferrer[]>([]);
const countries = ref<CountByCountry[]>([]);
const countByClientName = ref<CountByKeyValue[]>([]);
const countByOsName = ref<CountByKeyValue[]>([]);
const countByDeviceType = ref<CountByKeyValue[]>([]);
const countByDeviceBrand = ref<CountByKeyValue[]>([]);
const countByUtmSource = ref<CountByKeyValue[]>([]);
const countByUtmMedium = ref<CountByKeyValue[]>([]);
const countByUtmCampaign = ref<CountByKeyValue[]>([]);

async function fetchData(activeAppId: string, days: number) {
  const results = await Promise.all([
    getUniqueSessionsPerPage(activeAppId, days),
    getHitsPerPage(activeAppId, days),
    getTopReferrers(activeAppId, days),
    getUniqueVisitorsByCountry(activeAppId, days),
    getSessionCountByUserAgent(activeAppId, "client_name", days),
    getSessionCountByUserAgent(activeAppId, "os_name", days),
    getSessionCountByUserAgent(activeAppId, "device_type", days),
    getSessionCountByUserAgent(activeAppId, "device_brand", days),
    getSessionCountByUtmTag(activeAppId, "utm_source", days),
    getSessionCountByUtmTag(activeAppId, "utm_medium", days),
    getSessionCountByUtmTag(activeAppId, "utm_campaign", days),
  ]);
  sessions.value = results[0];
  hits.value = results[1];
  referrers.value = results[2];
  countries.value = results[3];
  countByClientName.value = results[4];
  countByOsName.value = results[5];
  countByDeviceType.value = results[6];
  countByDeviceBrand.value = results[7];
  countByUtmSource.value = results[8];
  countByUtmMedium.value = results[9];
  countByUtmCampaign.value = results[10];
}

const tableSessions = computed(() => sessions.value.map((x) => ({ key: x.path, value: x.count })));
const tableHits = computed(() => hits.value.map((x) => ({ key: x.path, value: x.count })));
const tableReferrers = computed(() => referrers.value.map((x) => ({ key: x.referrer, value: x.count })));
const tableCountry = computed(() =>
  countries.value.map((x) => ({ key: countryMap[x.country] || x.country, value: x.count }))
);
const tableClientName = computed(() =>
  countByClientName.value.map((x) => ({ key: x.value, value: x.count }))
);
const tableOS = computed(() => countByOsName.value.map((x) => ({ key: x.value, value: x.count })));
const tableDeviceType = computed(() =>
  countByDeviceType.value.map((x) => ({ key: x.value, value: x.count }))
);
const tableDeviceBrand = computed(() =>
  countByDeviceBrand.value.map((x) => ({ key: x.value, value: x.count }))
);

const tableUtmSource = computed(() =>
  countByUtmSource.value.filter((x) => x.value !== null).map((x) => ({ key: x.value, value: x.count }))
);
const tableUtmMedium = computed(() =>
  countByUtmMedium.value.filter((x) => x.value !== null).map((x) => ({ key: x.value, value: x.count }))
);
const tableUtmCampaign = computed(() =>
  countByUtmCampaign.value.filter((x) => x.value !== null).map((x) => ({ key: x.value, value: x.count }))
);

onMounted(() => fetchData(activeAppId.value, selectedDays.value));
watch([activeAppId, selectedDays], ([activeAppId, selectedDays]) => fetchData(activeAppId, selectedDays));
</script>
<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TableBlock :rows="tableSessions" title="Top unique visitors" />
      <TableBlock :rows="tableHits" title="Top page views" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <TableBlock :rows="tableReferrers" title="Referrers" />
      <TableBlock :rows="tableCountry" title="Countries" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <TableBlock :rows="tableClientName" title="Browser name" />
      <TableBlock :rows="tableOS" title="Operating system" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <TableBlock :rows="tableDeviceType" title="Device type" />
      <TableBlock :rows="tableDeviceBrand" title="Device brand" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <TableBlock :rows="tableUtmSource" title="UTM Source" />
      <TableBlock :rows="tableUtmMedium" title="UTM Medium" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <TableBlock :rows="tableUtmCampaign" title="UTM Campaign" />
    </div>
  </div>
</template>
