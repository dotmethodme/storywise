<script lang="ts" setup>
// layout
defineAppConfig({
  layout: "docs",
});

const { getPlanById } = usePlans();
const router = useRouter();
const route = useRoute();
const { signIn, data, status } = useAuth();
const variantId = ref(route.query.variantId as string);
const checked = ref(false);

const plan = computed(() => {
  if (!variantId.value) return null;
  return getPlanById(variantId.value);
});

onMounted(() => {
  if (!route.query.variantId) {
    router.push("/cloud");
  }
});

function startRegistration() {
  signIn("github", { callbackUrl: "/admin?variantId=" + variantId.value });
}
</script>
<template>
  <div class="flex justify-center items-center flex-col max-w-md m-auto mt-20">
    <h1 class="serif text-3xl mb-4 text-center">Register for storywise cloud</h1>
    <p class="mb-4">
      You've chosen the {{ plan?.size }}, billed {{ plan?.type }}, priced at {{ plan?.price }}. First, we'll
      create a storywise account for you. Then we'll take you through the payment process. Let's get started!
    </p>

    <div class="form-control">
      <label class="label cursor-pointer">
        <input type="checkbox" v-model="checked" class="checkbox checkbox-primary mr-4" />
        <span class="label-text">
          By creating an account, you accept our
          <NuxtLink class="link" href="/terms">Terms of Service</NuxtLink> and
          <NuxtLink class="link" href="/privacy">Privacy Policy</NuxtLink>
        </span>
      </label>
    </div>

    <button class="btn btn-primary mt-4" @click="startRegistration" :disabled="!checked">
      Register with GitHub
    </button>
  </div>
</template>
~/utils/plans
