<script setup lang="ts">
import useAuthStore from '~/stores/auth.store';
import type { UpdateProfileDto, User } from '~/types/api';

definePageMeta({
  middleware: ["auth"],
});
const authStore = useAuthStore();

const form  = reactive<UpdateProfileDto>({
  firstName: "",
  lastName: "",
  email: "",
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",

})
await callOnce("profile", async () => {
  await authStore.getProfileDetails();
});

watch(
  () => authStore.profile,
  (profile) => {
    if (!profile) return;

    form.firstName = profile.firstName ?? "";
    form.lastName = profile.lastName ?? "";
    form.email = profile.email ?? "";
    form.address = profile.address ?? {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    };
  },
  { immediate: true }
);

const updateProfile = async () => {
  try {
    await authStore.updateProfileDetails(form);
    // toast
  } catch (error) {
    // toast
  }
}
</script>
<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb account-breadcrumb">
        <span><NuxtLink to="/">Home</NuxtLink> / <strong>My Account</strong></span>
        <span>Welcome! <span class="price">{{authStore.user?.name}}</span></span>
      </div>
      <div class="account-grid">
        <aside class="account-menu">
          <h3>Manage My Account</h3>
          <NuxtLink to="/account" class="price">My Profile</NuxtLink>
          <a>Address Book</a>
          <a>My Payment Options</a>
          <h3 class="menu-spaced">My Orders</h3>
          <a>My Returns</a>
          <a>My Cancellations</a>
          <h3 class="menu-spaced">My WishList</h3>
        </aside>
        <section class="profile-card">
          <h2>Edit Your Profile</h2>
          <form class="form-grid">
            <label>First Name<input v-model="form.firstName" class="field"  /></label>
            <label>Last Name<input  v-model="form.lastName" class="field"  /></label>
            <label>Email<input class="field" v-model="form.email" readonly/></label>
            <!-- <label>Address<input class="field" value="Kingston, 5236, United State" /></label> -->
            <label class="span-2">Password Changes<input class="field" v-model="form.currentPassword" placeholder="Current Passwod" /></label>
            <input class="field span-2" v-model="form.newPassword"  placeholder="New Passwod" />
            <input class="field span-2" v-model="form.confirmPassword" placeholder="Confirm New Passwod" />
            <div class="span-2 profile-actions">
              <a>Cancel</a>
              <button class="btn" type="button" @click="updateProfile">Save Changes</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>
