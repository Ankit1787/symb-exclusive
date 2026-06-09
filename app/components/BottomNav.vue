<script setup lang="ts">
const route = useRoute();
const { toggleSidebar } = useSidebar();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const { totalItems: cartCount } = storeToRefs(cartStore);
const { count: wishlistCount } = storeToRefs(wishlistStore);
</script>

<template>
  <nav class="bottom-nav">
    <NuxtLink to="/" class="bottom-nav-item" :class="{ active: route.path === '/' }">
      <svg class="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span class="nav-label">Home</span>
    </NuxtLink>

    <button type="button" class="bottom-nav-item" @click="toggleSidebar">
      <svg class="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
      <span class="nav-label">Categories</span>
    </button>

    <NuxtLink to="/cart" class="bottom-nav-item badge-item" :class="{ active: route.path === '/cart' }">
      <div class="icon-badge-wrapper">
        <svg class="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span v-if="cartCount" class="nav-badge">{{ cartCount }}</span>
      </div>
      <span class="nav-label">Cart</span>
    </NuxtLink>

    <NuxtLink to="/wishlist" class="bottom-nav-item badge-item" :class="{ active: route.path === '/wishlist' }">
      <div class="icon-badge-wrapper">
        <svg class="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
        <span v-if="wishlistCount" class="nav-badge">{{ wishlistCount }}</span>
      </div>
      <span class="nav-label">Wishlist</span>
    </NuxtLink>

    <NuxtLink to="/myaccount" class="bottom-nav-item" :class="{ active: route.path === '/account' }">
      <svg class="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span class="nav-label">Profile</span>
    </NuxtLink>
  </nav>
</template>
