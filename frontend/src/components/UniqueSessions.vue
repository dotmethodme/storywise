<script lang="ts" setup>
import {
  CountByCountry,
  CountByKeyValue,
  CountByReferrer,
  CountHitsPerPage,
} from "@/generated/data-contracts";
import { generatedApi } from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import { countryMap } from "@/utils/countries";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import TableBlock from "./TableBlock.vue";

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
    generatedApi.getUniqueSessionsPerPage({ app_id: activeAppId, days }),
    generatedApi.getHitsPerPage({ app_id: activeAppId, days }),
    generatedApi.getTopReferrers({ app_id: activeAppId, days }),
    generatedApi.getUniqueSessionsByCountry({ app_id: activeAppId, days }),
    generatedApi.getCountSessionsByUserAgent({ app_id: activeAppId, key: "client_name", days }),
    generatedApi.getCountSessionsByUserAgent({ app_id: activeAppId, key: "os_name", days }),
    generatedApi.getCountSessionsByUserAgent({ app_id: activeAppId, key: "device_type", days }),
    generatedApi.getCountSessionsByUserAgent({ app_id: activeAppId, key: "device_brand", days }),
    generatedApi.getCountSessionsByUtm({ app_id: activeAppId, key: "utm_source", days }),
    generatedApi.getCountSessionsByUtm({ app_id: activeAppId, key: "utm_medium", days }),
    generatedApi.getCountSessionsByUtm({ app_id: activeAppId, key: "utm_campaign", days }),
  ]);
  sessions.value = results[0].data.items;
  hits.value = results[1].data.items;
  referrers.value = results[2].data.items;
  countries.value = results[3].data.items;
  countByClientName.value = results[4].data.items;
  countByOsName.value = results[5].data.items;
  countByDeviceType.value = results[6].data.items;
  countByDeviceBrand.value = results[7].data.items;
  countByUtmSource.value = results[8].data.items;
  countByUtmMedium.value = results[9].data.items;
  countByUtmCampaign.value = results[10].data.items;
}

const tableSessions = computed(() => sessions.value.map((x) => ({ key: x.path, value: x.count })));
const tableHits = computed(() => hits.value.map((x) => ({ key: x.path, value: x.count })));
const tableReferrers = computed(() => referrers.value.map((x) => ({ key: x.referrer, value: x.count })));
const tableCountry = computed(() =>
  countries.value.map((x) => ({
    key: x.country ? countryMap[x.country] || x.country : x.country,
    value: x.count,
  })),
);
const tableClientName = computed(() =>
  countByClientName.value.map((x) => ({ key: x.value, value: x.count })),
);
const tableOS = computed(() => countByOsName.value.map((x) => ({ key: x.value, value: x.count })));
const tableDeviceType = computed(() =>
  countByDeviceType.value.map((x) => ({ key: x.value, value: x.count })),
);
const tableDeviceBrand = computed(() =>
  countByDeviceBrand.value.map((x) => ({ key: x.value, value: x.count })),
);

const tableUtmSource = computed(() =>
  countByUtmSource.value.filter((x) => x.value !== null).map((x) => ({ key: x.value, value: x.count })),
);
const tableUtmMedium = computed(() =>
  countByUtmMedium.value.filter((x) => x.value !== null).map((x) => ({ key: x.value, value: x.count })),
);
const tableUtmCampaign = computed(() =>
  countByUtmCampaign.value.filter((x) => x.value !== null).map((x) => ({ key: x.value, value: x.count })),
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

      <TableBlock :rows="tableClientName" title="Browser name" />
      <TableBlock :rows="tableOS" title="Operating system" />

      <TableBlock :rows="tableDeviceType" title="Device type" />
      <TableBlock :rows="tableDeviceBrand" title="Device brand" />

      <TableBlock :rows="tableUtmSource" title="UTM Source" />
      <TableBlock :rows="tableUtmMedium" title="UTM Medium" />
      <TableBlock :rows="tableUtmCampaign" title="UTM Campaign" />
    </div>
  </div>
</template>
