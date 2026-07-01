<script setup lang="ts">
import { toast } from 'vue-sonner';

const wishlistStore = useWishlistStore();
const { items } = storeToRefs(wishlistStore);
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="section-head">
        <h1 class="subpage-title">Wishlist ({{ items?.length }})</h1>
      </div>
      <div class="wishlist-box">
        <div v-if="items.length > 0" class="grid-4">
          <ProductCard v-for="product in items" :key="product.id" :product="product" />
        </div>
        <div v-else>
          <p>No products in wishlist</p>
        </div>
      </div>


      <!-- <section class="related-section">
        <SectionHeader eyebrow="Just For You" title="" action="See All" />
        <div class="grid-4">
          <ProductCard v-for="product in items" :key="product.id" :product="product" />
        </div>
      </section> -->
    </div>
  </NuxtLayout>
</template>
