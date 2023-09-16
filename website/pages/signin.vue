<script setup lang="ts">
definePageMeta({
  layout: "none",
  middleware: ["auth"],
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/admin",
  },
});
const { signIn } = useAuth();
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center">
    <div class="normal-case px-4 font-bold text-4xl serif select-none mb-8">storywise cloud.</div>

    <div class="btn btn-outline mb-10" @click="signIn('github')">
      <Icon name="mdi:github" />
      Sign in with Github
    </div>
  </div>
</template>
