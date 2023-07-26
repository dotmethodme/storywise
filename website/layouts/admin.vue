<script setup lang="ts">
import { useAdminStore } from '@/stores/admin';

const adminStore = useAdminStore();

const { data } = await useFetch('/api/admin/user', { cache: 'no-cache', server: false });

if (data) {
  adminStore.setUser(data);
}

</script>
<template>
  <div class="drawer lg:drawer-open h-screen">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content">
      <label for="my-drawer-2"
        class="btn btn-primary drawer-button lg:hidden fixed bottom-4 left-4 opacity-1 rounded-full">
        <IconsMenu />
      </label>

      <div class="p-8">
        <slot />
      </div>
    </div>

    <div class="drawer-side border-r">
      <label for="my-drawer-2" class="drawer-overlay"></label>

      <div class="flex flex-col justify-between h-full">
        <div>
          <NuxtLink href="/admin" class="normal-case px-8 pt-8 pb-4 font-bold text-2xl serif text-center w-full flex">
            storywise.
          </NuxtLink>

          <ul class="menu p-4 w-80 h-full bg-base-100 text-accent-content border-base-200">
            <li>
              <NuxtLink href="/admin/">Overview</NuxtLink>
            </li>
            <li>
              <NuxtLink href="/admin/settings">Settings</NuxtLink>
            </li>
            <li>
              <NuxtLink href="/admin/billing">Billing</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <ul class="menu p-4 w-80 h-full bg-base-100 text-accent-content border-base-200">
            <li>
              <NuxtLink href="/admin/">Profile</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
