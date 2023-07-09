<template>
  <Navbar />

  <div class="flex gap-8 border-t-2 border-base-200">
    <div class="drawer lg:drawer-open w-full">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content flex flex-col items-center w-full">
        <label for="my-drawer-2"
          class="btn btn-primary drawer-button lg:hidden fixed bottom-4 left-4 opacity-1 rounded-full">
          <IconsMenu />
        </label>

        <slot />
      </div>

      <div class="drawer-side">
        <label for="my-drawer-2" class="drawer-overlay"></label>
        <ul class="menu p-0  w-80 h-full bg-base-100 text-base-content border-r-2 border-base-200">
          <!-- Sidebar content here -->
          <slot name="sidebar" />
        </ul>
      </div>
    </div>
  </div>

  <Footer />
</template>
