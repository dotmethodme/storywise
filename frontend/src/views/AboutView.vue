<script lang="ts" setup>
import CodePreview from "@/components/CodePreview.vue";
import { generatedApi } from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { formatDate } from "@/utils/dates";
import { DataIo } from "@/generated/data-contracts";

const store = useGlobalStore();
const { activeApp, activeAppId, apps } = storeToRefs(store);
const router = useRouter();

const deleteDialog = ref(false);
const deleteName = ref("");
const deleting = ref(false);

async function deleteAppHandler() {
  deleting.value = true;
  await generatedApi.deleteApp(activeAppId.value);
  await store.fetchApps();
  deleting.value = false;
  deleteDialog.value = false;
  router.push({
    path: `/${apps.value?.[0]?.id || ""}`,
  });
}

const updating = ref(false);
const updateName = ref("");

async function updateAppHandler() {
  updating.value = true;
  await generatedApi.updateApp(activeAppId.value, { name: updateName.value });
  await store.fetchApps();
  updating.value = false;
}

const dataIo = ref<DataIo[]>();
const hasPendingJobs = computed(() => dataIo.value && dataIo.value.some((item) => item.status === "pending"));
async function fetchDataIo() {
  const result = await generatedApi.getDataIo();
  dataIo.value = result.data.items;
  const hasPendingJobs = dataIo.value && dataIo.value.some((item) => item.status === "pending");
  if (hasPendingJobs) {
    setTimeout(fetchDataIo, 1000);
  }
}

async function createExportHander() {
  await generatedApi.startExport();
  await fetchDataIo();
}

function downloadFile(filePath: string) {
  const iframe = document.getElementById("downloadIframe") as HTMLIFrameElement;
  iframe.src = `/admin/api/data_io/storywise_export.jsonl?file_path=${filePath}`;
}

async function deleteDataIoHandler(id: string) {
  await generatedApi.deleteDataIo(id);
  await fetchDataIo();
}

onMounted(() => {
  updateName.value = activeApp.value?.name || "";
  fetchDataIo();
});
</script>

<template>
  <h2 class="mt-4 text-xl font-bold tracking-tight text-base-content text-left">Embed</h2>
  <p class="mt-4 mb-4 text-lg">Simply embed the following code in the head of your website:</p>
  <CodePreview />

  <h2 class="my-8 text-xl font-bold tracking-tight text-base-content text-left">Data exports/imports</h2>

  <!-- list data imports and exports -->
  <div class="w-full" v-if="dataIo && dataIo.length > 0">
    <table class="table w-full">
      <thead>
        <tr>
          <th>Created</th>
          <th>Status</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in dataIo" :key="i">
          <td>{{ formatDate(item.created_at) }}</td>
          <td>
            {{ item.status }}
          </td>
          <td class="text-right">
            <template v-if="item.status === 'complete'">
              <button class="btn btn-ghost btn-sm" @click="() => downloadFile(item.file_path!)">
                Download
              </button>
            </template>

            <template v-if="item.status === 'pending'">
              <div class="loading loading-xs mr-4"></div>
            </template>

            <button class="btn btn-ghost btn-sm" @click="() => deleteDataIoHandler(item.id!)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <iframe id="downloadIframe" style="display: none"></iframe>
  </div>

  <div class="w-full mt-4">
    <button class="btn btn-primary" @click="createExportHander" :disabled="hasPendingJobs">
      Export data
    </button>
  </div>

  <h2 class="my-8 text-xl font-bold tracking-tight text-base-content text-left">Configuration</h2>

  <div class="w-full">
    <div class="flex items-end">
      <div class="w-full">
        <label class="label">Site name</label>
        <input
          type="text"
          class="input input-bordered w-full"
          placeholder="example.com"
          v-model="updateName"
        />
      </div>
      <div>
        <button class="btn btn-primary ml-4" @click="updateAppHandler">
          <span v-if="updating">Updating...</span>
          <span v-else>Update</span>
        </button>
      </div>
    </div>

    <div class="mt-4"></div>

    <div class="w-full">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>API_BASE_URL</td>
            <td>{{ store.siteConfig?.apiBaseUrl }}</td>
          </tr>
          <tr>
            <td>ALLOWED_ORIGIN</td>
            <td>{{ store.siteConfig?.allowedOrigin }}</td>
          </tr>
        </tbody>
      </table>

      <div class="mt-8"></div>

      <button v-if="apps && apps.length > 1" class="btn btn-error" @click="deleteDialog = true">
        Delete site and all its data
      </button>
      <div
        v-else
        class="tooltip tooltip-error"
        data-tip="This is the only site left and it cannot be deleted. At least one site must be available at all times."
      >
        <button class="btn btn-error" disabled>Delete site and all its data</button>
      </div>
    </div>

    <dialog class="modal modal-bottom sm:modal-middle" :class="deleteDialog ? 'modal-open' : ''">
      <form method="dialog" class="modal-box max-h-max m-auto">
        <h1 class="text-2xl mb-4 serif tracking-tight">Are you absolutely sure?</h1>

        <p class="mb-4">
          Deleting this site effectively means that all the existing tracking will stop working, and the
          historical data will be deleted.
        </p>
        <p class="mb-4">Are you absolutely sure that you want to delete this site?</p>

        <p class="mb-4">
          If so, please type in the name of the site below to confirm that you want to delete it:
          <b>"{{ activeApp?.name }}"</b>
        </p>

        <input
          type="text"
          class="input input-bordered w-full"
          placeholder="example.com"
          v-model="deleteName"
        />

        <div>
          <button
            class="btn btn-error mt-4 w-full"
            @click="deleteAppHandler"
            :disabled="!!deleting || deleteName !== activeApp?.name"
          >
            <span v-if="deleting">Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
      </form>
      <form method="dialog" class="modal-backdrop" @click="() => (deleteDialog = false)"></form>
    </dialog>

    <div class="my-20"></div>
  </div>
</template>
