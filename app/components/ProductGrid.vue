<script setup lang="ts">
import type { Product } from "~/types/product";
import ProductSlider from "./ProductSlider.vue";
const sliderRef = ref();
const saleEndsAt = "2026-12-31T23:59:59";

const prev = () => {
  sliderRef.value?.slidePrev();
};

const next = () => {
  sliderRef.value?.slideNext();
};
withDefaults(
  defineProps<{
    products: Product[];
    title: string;
    eyebrow: string;
    link?: string;
    layout: "row" | "grid";
    loading?: boolean;
    skeletonCount?: number;
  }>(),
  {
    products: () => [],
    loading: false,
    skeletonCount: 4,
  },
);
const selectedProduct = ref<Product | null>(null);

const showQuickView = ref(false);

const openQuickView = (product: Product) => {
  selectedProduct.value = product;
  showQuickView.value = true;
};
</script>

<template>
  <div class="">
    <div  class="flex-between">
      <SectionHeader :eyebrow="eyebrow" :title="title" :link="link" />
      <CountdownTimer v-if="title=='Flash Sales'" :end-date="saleEndsAt" />

      <div class="btn-slider-box">
        <button @click="prev" class="btn-slider">
          <img src="/assets/arrow-left.svg" height="24" width="24" />
        </button>
        <button @click="next" class="btn-slider">
          <img src="/assets/arrow-right.svg" height="24" width="24" />
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="product-grid-skeleton"
      :class="layout === 'grid' ? 'grid-4' : 'product-grid-skeleton--row'"
    >
      <ProductCardSkeleton
        v-for="index in skeletonCount"
        :key="`product-skeleton-${index}`"
      />
    </div>

    <ProductSlider
      v-else-if="products.length"
      ref="sliderRef"
      :items="products"
      :layout="layout"
      :navigation="false"
    >
      <template #item="{ item }">
        <ProductCard
          :key="item.id"
          :product="item"
          @quick-view="openQuickView"
        />
      </template>
    </ProductSlider>

    <p v-else class="muted product-grid-empty">No products found.</p>

    <ProductQuickView
      :open="showQuickView"
      :product="selectedProduct"
      @close="showQuickView = false"
    />
  </div>
</template>

<style scoped>
.product-grid-skeleton--row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;
}

.product-grid-empty {
  padding: 24px 0;
}

@media (max-width: 1180px) {
  .product-grid-skeleton--row {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .product-grid-skeleton--row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
}

@media (max-width: 520px) {
  .product-grid-skeleton--row {
    grid-template-columns: 1fr;
  }
}
</style>
