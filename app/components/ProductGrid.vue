<script setup lang="ts">
import type { Product } from "~/types/product";
import ProductSlider from "./ProductSlider.vue";

withDefaults(
  defineProps<{
    products: Product[];
    layout:  "row" | "grid";
  }>(),
  {
    products: () => [],
  }
);
</script>

<template>
  <div class="">
    <ProductSlider :items="products" :layout="layout">
      <template #item="{ item }">
        <ProductCard :key="item.id" :product="item" />
      </template>
    </ProductSlider>
  </div>
</template>
