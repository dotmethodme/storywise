<script lang="ts" setup>
import type { StorywiseApp } from "~/types/types";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const { id } = route.params;

const username = ref("");
const password = ref("");

const isUserValid = computed(() => isUsernameValid(username.value));
const isPasswordValid = computed(() => password.value.length === 0 || password.value.length > 8);

const { data, pending, error } = useFetch<StorywiseApp>(`/api/admin/app`, {
  query: { id },
  onResponse: async (ctx) => {
    username.value = ctx.response._data.username;
  },
});

async function updateApp() {
  if (!isUserValid.value || !isPasswordValid.value) {
    return;
  }

  useLazyFetch(`/api/admin/app/edit`, {
    method: "PATCH",
    body: {
      id: id,
      username: username.value,
      ...{ password: password.value.length > 0 ? password.value : undefined },
    },
  });
}
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">
    <h1 class="serif font-bold text-3xl mb-8">Error</h1>
    <p>
      {{ error }}
    </p>
  </div>
  <div v-else-if="!!data">
    <h1 class="serif font-bold text-3xl mb-8">Details / {{ data?.name }}</h1>

    <div class="form-control w-full max-w-lg mb-4">
      <label class="label">
        <span class="label-text">Username</span>
      </label>
      <input
        type="text"
        v-model="username"
        placeholder="Username to be used to login to the app"
        class="input input-bordered w-full max-w-lg"
        :class="{ 'input-error': username?.length > 0 && !isUserValid }"
      />
    </div>

    <div class="form-control w-full max-w-lg">
      <label class="label">
        <span class="label-text">Password</span>
      </label>
      <input
        type="text"
        placeholder="Change the password or leave empty to keep the same"
        class="input input-bordered w-full max-w-lg"
        v-model="password"
        :class="{ 'input-error': password.length > 0 && !isPasswordValid }"
      />
      <label class="label">
        <span class="label-text-alt">
          Or
          <span class="link" @click="password = generatePassword(16)">generate</span>
          a random password
        </span>
      </label>
    </div>

    <button class="btn btn-primary mt-8" :disabled="!isUserValid || !isPasswordValid" @click="updateApp">
      Update
    </button>
  </div>
</template>
