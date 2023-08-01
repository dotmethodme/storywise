<script lang="ts" setup>
definePageMeta({
  layout: "admin",
});

const { data: list } = useFetch("/api/admin/app/list");

const createMessage = computed(() => {
  if (list.value?.length === 0) {
    return "Start using storywise by creating a new app. Click here!";
  }
  return "If you want to track a new app, click here!";
});
</script>

<template>
  <h1 class="serif font-bold text-3xl mb-8">Overview</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2-xl:grid-cols-4 select-none gap-4">
    <NuxtLink :to="`/admin/edit/${item._id}`" v-for="item in list">
      <AdminAppLink :item="item" />
    </NuxtLink>

    <NuxtLink to="/admin/create">
      <div class="card bg-base-100 border cursor-pointer hover:shadow-lg h-full">
        <div class="card-body px-6 py-6">
          <h2 class="card-title">
            <Icon size="30px" name="system-uicons:plus-circle" />
            Create a new app
          </h2>
          <p>{{ createMessage }}</p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
div {
  transition: all 0.2s ease-in-out;
}
</style>
