<script lang="ts" setup>
const { status, data, signIn, signOut } = useAuth()


if (status.value !== "authenticated") {
    await signIn();
}

</script>

<template>
    <div>
        <h1>HEY</h1>
        <pre>
            {{ data }}
        </pre>
    </div>
</template>