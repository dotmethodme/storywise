<script setup lang="ts">
import router from "@/router";
import { generatedApi } from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";
import CarretDown from "./icons/CarretDown.vue";
import FolderPlus from "./icons/FolderPlus.vue";

const route = useRoute();
const store = useGlobalStore();
const { apps, activeApp } = storeToRefs(store);

const showDialog = ref(false);
const creating = ref(false);
const deleteName = ref("");

async function createAppHandler() {
  creating.value = true;
  await generatedApi.createApp({ name: deleteName.value });
  await store.fetchApps();
  creating.value = false;
  showDialog.value = false;
  const lastApp = apps.value?.[apps.value.length - 1];
  router.push({ path: `/${lastApp?.id || ""}` });
}

function changeApp(appId: string) {
  router.push({ path: `/${appId}` });
  showDialog.value = false;
  if (document.activeElement) {
    (document.activeElement as HTMLElement).blur();
  }
}
</script>
<template>
  <div class="dropdown dropdown-bottom dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-sm rounded-xl">
      {{ activeApp?.name }}
      <CarretDown />
    </label>
    <ul tabindex="0" class="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52 gap-1">
      <li v-for="item in apps">
        <button :class="{ focus: route.params.appId === item.id }" @click="() => changeApp(item.id!)">
          {{ item.name }}
        </button>
      </li>
      <li>
        <button @click="showDialog = true">
          <FolderPlus />
          Create new site
        </button>
      </li>
    </ul>

    <dialog class="modal modal-bottom sm:modal-middle" :class="showDialog ? 'modal-open' : ''">
      <form method="dialog" class="modal-box max-h-max m-auto">
        <h1 class="text-2xl mb-4 serif tracking-tight">Create new site</h1>
        <p class="mb-4">Type in the name of the new site to get started</p>

        <input
          type="text"
          class="input input-bordered w-full"
          placeholder="example.com"
          v-model="deleteName"
        />

        <div>
          <button class="btn btn-primary mt-4 w-full" @click="createAppHandler">
            <span v-if="creating">Creating...</span>
            <span v-else>Create</span>
          </button>
        </div>
      </form>
      <form method="dialog" class="modal-backdrop" @click="() => (showDialog = false)"></form>
    </dialog>
  </div>
</template>
