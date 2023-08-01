<script lang="ts" setup>
const showCookieBanner = ref(false);

const hideCookieBanner = () => {
    showCookieBanner.value = false;
    localStorage.setItem('show_cookie_banner', 'false');
};


onMounted(() => {
    if (localStorage.getItem('show_cookie_banner') !== 'false') {
        showCookieBanner.value = true;
    }
});
</script> 
  
<template>
    <div class="w-100 p-2 container">
        <div v-if="showCookieBanner" class="rounded-md bg-base-100 text-base-content py-2 px-4 shadow-lg border">
            By using this website, you agree to our <NuxtLink class="link" href="/cookies">cookie policy</NuxtLink>.
            <button class="link" @click="hideCookieBanner">Got it!</button>
        </div>
    </div>
</template>

<style scoped>
.container {
    position: fixed;
    bottom: 0;
    left: 0;
    max-width: 510px;
}
</style>