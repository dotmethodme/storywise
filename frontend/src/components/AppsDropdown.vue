<script setup lang="ts">
import { createApp } from "@/service/data";
import { useGlobalStore } from "@/stores/global";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useGlobalStore();
const { apps, activeApp } = storeToRefs(store);

const showDialog = ref(false);
const creating = ref(false);
const name = ref("");

async function createAppHandler() {
  creating.value = true;

  await createApp(name.value);

  store.fetchApps();

  creating.value = false;
  showDialog.value = false;
}
</script>
<template>
  <div class="dropdown dropdown-bottom dropdown-end">
    <label tabindex="0" class="btn btn-ghost btn-md rounded-xl">
      {{ activeApp?.name }}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </label>
    <ul tabindex="0" class="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52">
      <li v-for="item in apps">
        <a :class="{ focus: route.params.appId === item.id }" :href="`#/${item.id}`">{{ item.name }}</a>
      </li>
      <!-- create -->
      <li>
        <button @click="showDialog = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h5.175q.4 0 .763.15t.637.425L12 6h8q.825 0 1.413.588T22 8v10q0 .825-.588 1.413T20 20H4Zm0-2h16V8h-8.825l-2-2H4v12Zm0 0V6v12Zm10-4v1q0 .425.288.713T15 16q.425 0 .713-.288T16 15v-1h1q.425 0 .713-.288T18 13q0-.425-.288-.713T17 12h-1v-1q0-.425-.288-.713T15 10q-.425 0-.713.288T14 11v1h-1q-.425 0-.713.288T12 13q0 .425.288.713T13 14h1Z"
            />
          </svg>
          Create new app
        </button>
      </li>
    </ul>

    <dialog class="modal modal-bottom sm:modal-middle" :class="showDialog ? 'modal-open' : ''">
      <form method="dialog" class="modal-box max-h-max m-auto">
        <h1 class="text-2xl mb-4 serif tracking-tight">Create a new app</h1>
        <input type="text" class="input input-bordered w-full" placeholder="App name" v-model="name" />

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
