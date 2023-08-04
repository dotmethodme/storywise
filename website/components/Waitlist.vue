<script lang="ts" setup>
const email = ref("");
const triedToSubmit = ref(false);
const successModal = ref(false);

const isValidEmail = computed(() => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email.value).toLowerCase());
});

async function submit() {
  if (!isValidEmail.value) {
    triedToSubmit.value = true;
    return;
  }

  const { data, error } = await useFetch("/api/waitlist", {
    method: "POST",
    body: {
      email: email.value,
    },
  });

  if (error.value) {
    debugger;
    alert(
      "Something went wrong. Please try a different email or let me know about the issue at hey@joinstorywise.com"
    );
    return;
  }

  successModal.value = true;
  email.value = "";
}
</script>
<template>
  <div id="sign-up" class="bg-base-200 py-20 px-4 sm:px-8">
    <h1 class="text-4xl font-bold tracking-tight text-center mb-4">We're working on storywise cloud</h1>
    <p class="text-center text-lg mb-10 opacity-50">Spoiler alert: it's gonna be awesome!</p>
    <div class="md:columns-2 gap-8 max-w-6xl mx-auto justify-center items-center">
      <div class="">
        <h2 class="text-3xl font-bold mb-4 serif">Want to join early?</h2>
        <p class="mb-4">
          At heart storywise is open source and made to self-host. However, for those who don't want to deal
          with the hassle of managing their own servers, we plan to launch a cloud version of storywise. It'll
          be the same open-source software, but we'll manage the servers for you.
        </p>
        <p class="mb-4">
          If you're interested in joining the waitlist, please enter your email below. We'll send you an email
          when we're ready to launch.
        </p>
      </div>

      <div>
        <div class="flex items-center mb-4">
          <input
            type="text"
            placeholder="Your email here..."
            class="input input-bordered input-lg w-full"
            v-model="email"
            :class="{
              'border-green-500': email && isValidEmail,
              'border-red-500': email && triedToSubmit && !isValidEmail,
            }"
            @keydown.enter="submit"
          />
        </div>
        <button class="btn btn-outline w-full" type="submit" @click="submit">Join the waitlist</button>
        <p class="text-left text-sm text-gray-400 mt-2">
          By joining the waitlist, you agree to receive email updates about the product, and you agree to our
          <a class="link" href="/privacy">privacy policy</a>.
        </p>
      </div>
    </div>

    <!-- Open the modal using ID.showModal() method -->
    <dialog
      id="my_modal_2"
      class="modal"
      :class="{
        'modal-open': successModal,
      }"
    >
      <form method="dialog" class="modal-box">
        <h3 class="font-bold text-2xl">Welcome to the waitlist! 🥳</h3>
        <p class="py-4">
          Thank you for joining! As we'll get closer to having a product ready, you'll be invited to
          participate and try the product out.
        </p>

        <p>
          If you want to get in touch with us before, feel free to reach out at
          <a class="link" href="mailto:hey@joinstorywise.com"> hey@joinstorywise.com </a>
        </p>

        <p class="py-4">Thank you for your patience, and we're excited to have you on board!</p>

        <p class="py-4">
          All the best,
          <br />
          Mihai
        </p>
      </form>
      <form method="dialog" class="modal-backdrop" @click="successModal = false"></form>
    </dialog>
  </div>
</template>
