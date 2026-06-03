<script setup lang="ts">
const wishlistStore=useWishlistStore();
const {items}= storeToRefs(wishlistStore);
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="section-head">
        <h1 class="subpage-title">Wishlist ({{ items?.length }})</h1>
        <button class="btn outline">Move All To Bag</button>
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
