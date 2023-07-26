<template>
  <div class="drawer lg:drawer-open w-full">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col items-center w-full">
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
  </div>
</template>
