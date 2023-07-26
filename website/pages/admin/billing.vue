<template>
    <h1 class="serif font-bold text-3xl mb-4">Billing</h1>
    <p>Hi {{ data }}</p>
</template>

<script lang="ts" setup>
definePageMeta({
    layout: "admin",
});

const { data } = useAuth()
</script>