<script setup lang="ts">
import auth from '~/middleware/auth';
import useAuthStore from '~/stores/auth.store';


const showProfileMenu = ref(false);
const authStore = useAuthStore();
const logout =async () => {
  // Handle logout logic here
  await authStore.logout()
};

const toggleProfileMenu = () => {
  if(authStore.isAuthenticated)
  showProfileMenu.value = !showProfileMenu.value;
  else{
    navigateTo('/login')
  }
};

const closeProfileMenu = () => {
  showProfileMenu.value = false;
};

onMounted(() => {
  document.addEventListener("click", closeProfileMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeProfileMenu);
});
</script>
<template>
  <header>
    <div class="topbar">
      <div class="container">
        <span
          >Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          <NuxtLink to="/">ShopNow</NuxtLink></span
        >
        <span>English ˅</span>
      </div>
    </div>
    <div class="header">
      <div class="container header-main">
        <NuxtLink class="logo" to="/">Exclusive</NuxtLink>
        <nav class="nav" aria-label="Main navigation">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/signup">Sign Up</NuxtLink>
        </nav>
        <div class="header-actions">
          <div class="search-container">
            <input class="search" placeholder="What are you looking for?" />
            <img src="/assets/search.svg" class="search-icon" />
          </div>
          <NuxtLink class="icon-btn" to="/wishlist" aria-label="Wishlist"
            ><img src="/assets/wishlist.svg"
          /></NuxtLink>
          <NuxtLink class="icon-btn" to="/cart" aria-label="Cart"
            ><img src="/assets/cart.svg"
          /></NuxtLink>
          <div class="profile-wrapper" @click.stop>
            <button
              class="icon-btn profile-btn"
              @click.stop="toggleProfileMenu"
            >
              <img src="/assets/user.svg" />
            </button>

            <Transition name="dropdown">
              <div v-if="showProfileMenu" class="profile-dropdown">
                <NuxtLink to="/account" class="dropdown-item">
                  <img src="/assets/icon-user.svg" />
                  <span>Manage My Account</span>
                </NuxtLink>

                <NuxtLink to="/orders" class="dropdown-item">
                  <img src="/assets/icon-mallbag.svg" />
                  <span>My Orders</span>
                </NuxtLink>

                <NuxtLink to="/cancellations" class="dropdown-item">
                  <img src="/assets/icon-cancel.svg" />
                  <span>My Cancellations</span>
                </NuxtLink>

                <NuxtLink to="/reviews" class="dropdown-item">
                  <img src="/assets/icon-review.svg" />
                  <span>My Reviews</span>
                </NuxtLink>

                <button class="dropdown-item logout-btn" @click="logout">
                  <img src="/assets/Icon-logout.svg" />
                  <span>Logout</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
