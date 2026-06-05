<script setup lang="ts">
import { toast } from 'vue-sonner';

const wishlistStore=useWishlistStore();
const {items}= storeToRefs(wishlistStore);
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="section-head">
        <h1 class="subpage-title">Wishlist ({{ items?.length }})</h1>
      </div>
      <div class="grid-4">
        <ProductCard v-for="product in items" :key="product.id" :product="product" />
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
