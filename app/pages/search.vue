<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ProductGrid from '~/components/ProductGrid.vue';
import { useProductStore } from '~/stores/product.store';

const route = useRoute();
const productStore = useProductStore();
const { products } = storeToRefs(productStore);
const { searchProducts } = useProductSearch();

const query = ref((route.query.q as string) ?? '');
const results = ref([] as any[]);
const loading = ref(false);
const errorMessage = ref('');
let timer: ReturnType<typeof setTimeout> | null = null;

const performSearch = async (q: string) => {
  if (!q || !q.trim()) {
    results.value = [];
    errorMessage.value = '';
    return;
  }
  loading.value = true;
  errorMessage.value = '';
  try {
    results.value = await searchProducts(q);
  } catch (err) {
    results.value = [];
    errorMessage.value = 'Unable to search products right now.';
  } finally {
    loading.value = false;
  }
};

watch(query, (val) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => performSearch(val), 400);
});

onMounted(() => {
  if (!products.value || products.value.length === 0) {
    productStore.fetchProducts();
  }
  if (query.value) performSearch(query.value);
});
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <h1>Search</h1>
      <div class="search-box">
        <input v-model="query" placeholder="Search products..." />
        <button @click="performSearch(query)">Search</button>
      </div>

      <p v-if="errorMessage" class="search-error">{{ errorMessage }}</p>

      <ProductGrid
        :products="results"
        layout="row"
        title="Search Results"
        eyebrow="Results"
        :loading="loading"
        :skeleton-count="4"
      />
    </div>
  </NuxtLayout>
</template>

<style scoped>
.search-box { display:flex; gap:8px; margin-bottom: 16px; }
.search-box input { flex:1; padding:8px 12px; border:1px solid #ddd; border-radius:6px }
.search-box button { padding:8px 12px; background:#DB4444; color:#fff; border:none; border-radius:6px }
.search-error { color:#DB4444; margin-bottom: 16px; }
</style>
