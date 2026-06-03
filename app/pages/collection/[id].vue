<script setup lang="ts">
const productStore= useProductStore();
const {collections:items} = storeToRefs(productStore);

const collectionMap = {
  all: "",
  bestseller: "best-seller",
  newarrival: "new-arrival",
  sale: "flash-sale",
  featured: "featured",
} as const;

const routesObj={
    all:"All Products",
    bestseller:"Bestsellers",
    newarrival:"New Arrivals",
    sale:"On Sale",
    featured:"Featured"
}
const route = useRoute();
const id = route.params.id;
const title = routesObj[id as keyof typeof routesObj] || 'All Products';
const key = collectionMap[id as keyof typeof collectionMap] || "";
await productStore.fetchProductsByCollection(key,true); 
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="section-head">
        <h1 class="subpage-title">{{title}} ({{ items?.length }})</h1>
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
