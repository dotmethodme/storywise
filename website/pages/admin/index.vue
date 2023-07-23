<template>
    <div>
        <h1>Admin</h1>
        <p>Hi {{ data }}</p>
    </div>
</template>

<script lang="ts" setup>
const { data } = useAuth()
</script>