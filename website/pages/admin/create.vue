<script lang="ts" setup>
import { generatePassword } from "@/utils/generatePassword";
import { isAppNameValid, isUsernameValid } from "@/utils/validators";

definePageMeta({
  layout: "admin",
});

const name = ref("");
const username = ref("admin");
const password = ref("");

const isNameValid = computed(() => isAppNameValid(name.value));
const isUserValid = computed(() => isUsernameValid(username.value));
const isPasswordValid = computed(() => password.value.length > 8);

const router = useRouter();

onMounted(() => {
  password.value = generatePassword(16);
});

async function createApp() {
  if (!isNameValid.value || !isUserValid.value || !isPasswordValid.value) {
    return;
  }

  const data = {
    name: name.value,
    username: username.value,
    password: password.value,
  };

  const createdApp = await useFetch("/api/admin/app/create", {
    method: "POST",
    body: data,
  });

  if (createdApp) {
    router.push(`/admin/edit/${createdApp.data.value?.name}`);
  }
}
</script>

<template>
  <h1 class="serif font-bold text-3xl mb-8">Creating a new storywise app</h1>

  <div class="form-control w-full max-w-lg">
    <label class="label">
      <span class="label-text">Storywise app name</span>
    </label>

    <input
      type="text"
      v-model="name"
      placeholder="Input the new app name"
      class="input input-bordered w-full max-w-lg"
      :class="{ 'input-error': name.length > 0 && !isNameValid }"
    />
    <label class="label">
      <span class="label-text-alt">
        Will be used to generate the app's URL. Must only contain numbers and lowercase letters, and be
        between 3-15 characters long.
      </span>
    </label>
  </div>

  <div class="form-control w-full max-w-lg mb-4">
    <label class="label">
      <span class="label-text">Username</span>
    </label>
    <input
      type="text"
      v-model="username"
      placeholder="Username to be used to login to the app"
      class="input input-bordered w-full max-w-lg"
      :class="{ 'input-error': username.length > 0 && !isUserValid }"
    />
  </div>

  <div class="form-control w-full max-w-lg">
    <label class="label">
      <span class="label-text">Password</span>
    </label>
    <input
      type="text"
      placeholder="The new password to be used to login to the app"
      class="input input-bordered w-full max-w-lg"
      v-model="password"
      :class="{ 'input-error': password.length > 0 && !isPasswordValid }"
    />
  </div>

  <button
    class="btn btn-primary mt-8"
    :disabled="!isNameValid || !isUserValid || !isPasswordValid"
    @click="createApp"
  >
    Create app
  </button>
</template>
