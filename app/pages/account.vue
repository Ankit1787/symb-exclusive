<script lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>
<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb account-breadcrumb">
        <span><NuxtLink to="/">Home</NuxtLink> / <strong>My Account</strong></span>
        <span>Welcome! <span class="price">Md Rimel</span></span>
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
            <label>First Name<input class="field" value="Md" /></label>
            <label>Last Name<input class="field" value="Rimel" /></label>
            <label>Email<input class="field" value="rimel1111@gmail.com" /></label>
            <label>Address<input class="field" value="Kingston, 5236, United State" /></label>
            <label class="span-2">Password Changes<input class="field" placeholder="Current Passwod" /></label>
            <input class="field span-2" placeholder="New Passwod" />
            <input class="field span-2" placeholder="Confirm New Passwod" />
            <div class="span-2 profile-actions">
              <a>Cancel</a>
              <button class="btn" type="button">Save Changes</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </NuxtLayout>
</template>
