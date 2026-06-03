<script setup lang="ts">
import { toast } from 'vue-sonner';
import type { Product } from '~/types/product';

const wishlistStore=useWishlistStore();
const cartStore=useCartStore();
const {items}= storeToRefs(wishlistStore);
const moveToBag = (
) => {

  cartStore.addMultipleToCart(items.value);

  wishlistStore.clear();

  toast.success(
    "Moved to cart"
  );
};
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="section-head">
        <h1 class="subpage-title">Wishlist ({{ items?.length }})</h1>
        <button class="btn outline" @click="moveToBag">Move All To Bag</button>
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
