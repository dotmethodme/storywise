<template>
  <section class="bg-base-100 mb-10">
    <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-8 lg:px-6">
      <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
        <div>
          <div
            class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <svg width="24px" height="24px" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"></path>
            </svg>
          </div>
          <h3 class="mb-2 text-xl font-bold dark:text-white">Simple</h3>
          <p class="text-gray-500 dark:text-gray-400">
            Core design principle for this project - simplicity. Storywise
            doesn't deliver bells and whistles. Here, we keep it simple!
          </p>
        </div>
        <div>
          <div
            class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <IconsRocket />
          </div>
          <h3 class="mb-2 text-xl font-bold dark:text-white">Private</h3>
          <p class="text-gray-500 dark:text-gray-400">
            With the self-hosted option, you can take full control of your data.
            No more uncertainty about where the data goes. You can literally
            bring your own database.
          </p>
        </div>
        <div>
          <div
            class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
            <IconsShareBox />
          </div>
          <h3 class="mb-2 text-xl font-bold dark:text-white">Open source</h3>
          <p class="text-gray-500 dark:text-gray-400">
            This project was born out of the desire to self-host. Storywise is
            open source so you can both self-host and trust what's under the
            hood.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
