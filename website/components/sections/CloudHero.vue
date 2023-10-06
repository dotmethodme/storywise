<template>
  <div class="px-4 py-8 max-w-screen-xl m-auto flex-col lg:flex-row flex justify-center gap-4 items-center">
    <div class="flex flex-col flex-1 align-center justify-center m-0 max-w-lg">
      <h1 class="serif text-5xl mb-4 font-bold tracking-tight">The storywise cloud</h1>
      <p class="sans text-xl">
        A simple and robust architecture where storywise does all the work, but you're in control.
      </p>
      <ul class="text-xl mt-4">
        <li class="mb-2">
          <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
          <span class="ml-4">Simple to get started & manage</span>
        </li>
        <li class="mb-2">
          <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
          <span class="ml-4">Fair pricing based on storage</span>
        </li>
        <li class="mb-2">
          <Icon size="1.4em" name="ic:round-check" class="text-green-600" />
          <span class="ml-4">Your own dedicated & scalable infrastructure</span>
        </li>
      </ul>

      <div class="mt-4 flex gap-2">
        <a href="#sign-up" class="btn btn-primary">Join storywise cloud</a>
        <a href="#pricing" class="btn btn-ghost">See pricing</a>
      </div>
    </div>

    <div class="max-w-lg dark:invert">
      <img src="~/assets/images/cloud-3.png" alt="Architecture of storywise cloud" />
    </div>
  </div>
</template>
