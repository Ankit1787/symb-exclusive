<script setup lang="ts">
import { CategoriesMap } from '~/data/catalog';

const productStore = useProductStore();
const { categoryProducts: items, categoryProductsLoading } = storeToRefs(productStore);

const route = useRoute();
const id = computed(() => route.params.id as string);
const title = computed(() => CategoriesMap[id.value] || 'All Products');

watch(id, (newId) => {
  if (newId) {
    void productStore.fetchProductsByCategory(newId);
  }
}, { immediate: true });
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="section-head">
        <h1 class="subpage-title">{{title}} ({{ items?.length }})</h1>
      </div>
      <div v-if="categoryProductsLoading" class="grid-4">
        <ProductCardSkeleton
          v-for="index in 8"
          :key="`collection-skeleton-${index}`"
        />
      </div>
      <div v-else class="grid-4">
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
