<template>
  <div class="navbar bg-base-100 text-accent-content">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </label>
        <ul tabindex="0" class="menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-72">
          <li>
            <NuxtLink href="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/contact">Contact</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/docs">Docs</NuxtLink>
          </li>
          <li>
            <NuxtLink href="/privacy">Privacy</NuxtLink>
          </li>
        </ul>
      </div>
      <NuxtLink href="/" class="normal-case px-4 font-bold text-2xl serif">storywise.</NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li>
          <NuxtLink href="/">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink href="/contact">Contact</NuxtLink>
        </li>
        <li>
          <NuxtLink href="/docs">Docs</NuxtLink>
      </li>
      <li>
        <NuxtLink href="/privacy">Privacy</NuxtLink>
      </li>
    </ul>
  </div>
  <div class="navbar-end">
    <a class="btn btn-ghost mr-2" href="https://github.com/dotmethodme/storywise" target="_blank">
      <IconsGithub />
      GitHub
    </a>
  </div>
</div></template>
