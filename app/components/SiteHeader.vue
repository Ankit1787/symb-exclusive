<script setup lang="ts">
import useAuthStore from '~/stores/auth.store';
import type { Product } from '~/types/product';
import { categories } from '~/data/catalog';

const { isSidebarOpen } = useSidebar();


const showProfileMenu = ref(false);
const searchTerm = ref('');
const searchFocused = ref(false);
const searchLoading = ref(false);
const searchError = ref('');
const searchResults = ref<Product[]>([]);
const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const { totalItems: cartCount } = storeToRefs(cartStore);
const { count: wishlistCount } = storeToRefs(wishlistStore);
const { searchProducts } = useProductSearch();
let searchTimer: ReturnType<typeof setTimeout> | null = null;
let searchRequestId = 0;

const trimmedSearch = computed(() => searchTerm.value.trim());
const showSearchDropdown = computed(
  () =>
    searchFocused.value &&
    Boolean(
      trimmedSearch.value ||
        searchLoading.value ||
        searchError.value ||
        searchResults.value.length,
    ),
);

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
  searchFocused.value = false;
};

onMounted(() => {
  document.addEventListener("click", closeProfileMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeProfileMenu);
  if (searchTimer) clearTimeout(searchTimer);
});

const goSearch = () => {
  if (!trimmedSearch.value) return;
  searchFocused.value = false;
  navigateTo(`/search?q=${encodeURIComponent(trimmedSearch.value)}`);
};

const openProduct = (product: Product) => {
  searchFocused.value = false;
  navigateTo(`/product/${product._id || product.id}`);
};

watch(searchTerm, (value) => {
  if (searchTimer) clearTimeout(searchTimer);

  const term = value.trim();
  if (!term) {
    searchResults.value = [];
    searchError.value = '';
    searchLoading.value = false;
    return;
  }

  searchLoading.value = true;
  searchError.value = '';
  const requestId = ++searchRequestId;

  searchTimer = setTimeout(async () => {
    try {
      const results = await searchProducts(term);
      if (requestId !== searchRequestId) return;
      searchResults.value = results.slice(0, 6);
    } catch (error) {
      if (requestId !== searchRequestId) return;
      searchResults.value = [];
      searchError.value = 'Unable to search products right now.';
    } finally {
      if (requestId === searchRequestId) searchLoading.value = false;
    }
  }, 400);
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
        <div class="logo-wrapper">
          <button class="hamburger-btn" type="button" @click="isSidebarOpen = true" aria-label="Open menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <NuxtLink class="logo" to="/">Exclusive</NuxtLink>
        </div>
        <nav class="nav" aria-label="Main navigation">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/signup">Sign Up</NuxtLink>
        </nav>
        <div class="header-actions">
          <div class="search-container" @click.stop>
            <input
              v-model="searchTerm"
              @focus="searchFocused = true"
              @keydown.enter="goSearch"
              class="search"
              placeholder="What are you looking for?"
            />
            <img src="/assets/search.svg" class="search-icon" @click="goSearch" />

            <Transition name="search-dropdown">
              <div v-if="showSearchDropdown" class="search-dropdown">
                <div v-if="searchLoading" class="search-state">Searching...</div>
                <div v-else-if="searchError" class="search-state search-state-error">
                  {{ searchError }}
                </div>
                <div
                  v-else-if="trimmedSearch && !searchResults.length"
                  class="search-state"
                >
                  No products found.
                </div>
                <template v-else>
                  <button
                    v-for="product in searchResults"
                    :key="product._id || product.id"
                    type="button"
                    class="search-result"
                    @click="openProduct(product)"
                  >
                    <img
                      :src="product.thumbnail || product.images?.[0]"
                      :alt="product.title"
                    />
                    <span>
                      <strong>{{ product.title }}</strong>
                      <small>{{ product.category }}</small>
                    </span>
                    <em>${{ product.price }}</em>
                  </button>
                  <button
                    v-if="trimmedSearch"
                    type="button"
                    class="search-view-all"
                    @click="goSearch"
                  >
                    View all results
                  </button>
                </template>
              </div>
            </Transition>
          </div>
          <NuxtLink class="icon-btn badge-icon" to="/wishlist" aria-label="Wishlist">
            <img src="/assets/wishlist.svg" />
            <span v-if="wishlistCount" class="count-badge">{{ wishlistCount }}</span>
          </NuxtLink>
          <NuxtLink class="icon-btn badge-icon" to="/cart" aria-label="Cart">
            <img src="/assets/cart.svg" />
            <span v-if="cartCount" class="count-badge">{{ cartCount }}</span>
          </NuxtLink>
          <div class="profile-wrapper" @click.stop>
            <button
              class="icon-btn profile-btn"
              @click.stop="toggleProfileMenu"
            >
              <img src="/assets/user.svg" />
            </button>

            <Transition name="dropdown">
              <div v-if="showProfileMenu" class="profile-dropdown">
                <NuxtLink to="/myaccount" class="dropdown-item">
                  <img src="/assets/icon-user.svg" />
                  <span>Manage My Account</span>
                </NuxtLink>

                <NuxtLink to="/myaccount/myorders" class="dropdown-item">
                  <img src="/assets/icon-mallbag.svg" />
                  <span>My Orders</span>
                </NuxtLink>

                <!-- <NuxtLink to="/cancellations" class="dropdown-item">
                  <img src="/assets/icon-cancel.svg" />
                  <span>My Cancellations</span>
                </NuxtLink>

                <NuxtLink to="/reviews" class="dropdown-item">
                  <img src="/assets/icon-review.svg" />
                  <span>My Reviews</span>
                </NuxtLink> -->

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

  <!-- Sidebar Drawer for Mobile/Tablet -->
  <div class="sidebar-wrapper">
    <Transition name="sidebar-fade">
      <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
    </Transition>
    <Transition name="sidebar-slide">
      <div v-if="isSidebarOpen" class="sidebar-drawer">
        <div class="sidebar-header">
          <span class="sidebar-logo">Exclusive</span>
          <button class="sidebar-close-btn" @click="isSidebarOpen = false" aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="sidebar-content">
          <!-- Categories list -->
          <div class="sidebar-section-title">Categories</div>
          <nav class="sidebar-categories">
            <NuxtLink
              v-for="cat in categories"
              :key="cat"
              :to="`/collection/${cat}`"
              class="sidebar-cat-link"
              @click="isSidebarOpen = false"
            >
              <span>{{ cat }}</span>
              <span v-if="cat.includes('Fashion')" class="sidebar-caret">›</span>
            </NuxtLink>
          </nav>
          
          <div class="soft-rule"></div>
          
          <!-- Quick Navigation Links -->
          <div class="sidebar-section-title">Menu</div>
          <nav class="sidebar-nav">
            <NuxtLink to="/" @click="isSidebarOpen = false">Home</NuxtLink>
            <NuxtLink to="/contact" @click="isSidebarOpen = false">Contact</NuxtLink>
            <NuxtLink to="/about" @click="isSidebarOpen = false">About</NuxtLink>
            <NuxtLink to="/signup" @click="isSidebarOpen = false">Sign Up</NuxtLink>
          </nav>
        </div>
      </div>
    </Transition>
  </div>
</template>
