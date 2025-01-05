<script lang="ts" setup>
const done = [
  "Time range selector (preset for now)",
  "Unique visitors over time",
  "General stats (total visitors, total pageviews, views per visitor)",
  "Unique visitors per page (top 10 + more)",
  "Pageviews per page (top 10 + more)",
  "Top referrers (top 10 + more)",
  "Top countries (top 10 + more)",
  "Documentation website",
  "Postgres support",
  "SQLite support (libsql)",
  "Top devices - mobile, desktop, tablet",
  "Top browsers - chrome, safari, firefox, edge, etc",
  "Top OS - windows, mac, linux, ios, android, etc",
  "TimescaleDB support",
  "Export data to json",
  "Import data from json",
  "UTM tags",
];

const todo = [
  "Privacy levels - sever-side only, client-side fingerprint, client-side local storage (current default)",
  "Custom events",
  "User retention analysis",
];
</script>

<template>
  <section class="bg-base-100 mb-10">
    <div class="py-10 px-4 sm:px-8 xl:px-0 mx-auto max-w-6xl">
      <h1 class="text-4xl font-bold tracking-tight text-center mb-4">The road so far...</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 mt-4">
        <div class="mb-4">
          <h2 class="sans text-xl mb-4">Done so far</h2>

          <ul>
            <li class="items-center flex gap-4 mb-3" v-for="item in done">
              <input type="checkbox" :checked="true" class="checkbox checkbox-success" /> {{ item }}
            </li>
          </ul>
        </div>

        <div class="col">
          <h2 class="sans text-xl mb-4">Future</h2>

          <ul>
            <li class="items-center flex gap-4 mb-3" v-for="item in todo">
              <input type="checkbox" :checked="true" disabled class="checkbox" /> {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
