<template>
    <div>
        <p>Sign-In Options:</p>
        <button class="btn btn-primary" @click="signIn('github')">Github</button>
    </div>
</template>


<script lang="ts" setup>
definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/',
    }
})

const { signIn, data, status } = useAuth();

if (status.value === 'authenticated') {
    navigateTo('/admin');
}
</script>
