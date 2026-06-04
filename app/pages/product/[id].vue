<script setup lang="ts">
import { toast } from "vue-sonner";
import ProductGrid from "~/components/ProductGrid.vue";

const productStore = useProductStore();
const route = useRoute();
const { currentProduct, similarProducts, relatedProductsLoading } =
  storeToRefs(productStore);
await productStore.fetchSingleProduct(route.params.id as string);

const cart = useCartStore();
const wishlist = useWishlistStore();

const qty = ref(1);
const selectedColor = ref<string | null>(null);
const selectedSize = ref<string | null>(null);

const availableColors = computed<string[]>(() => {
  const product = currentProduct.value as any;
  return product?.colors ?? product?.colours ?? ["#a0bce0", "#e07575"];
});

const availableSizes = computed<string[]>(() => {
  const product = currentProduct.value as any;
  return product?.sizes ?? ["XS", "S", "M", "L", "XL"];
});

watch(
  currentProduct,
  () => {
    selectedColor.value = null;
    selectedSize.value = null;
    qty.value = 1;
  },
  { immediate: true },
);

const increase = () => {
  qty.value++;
};
const decrease = () => {
  qty.value = Math.max(1, qty.value - 1);
};

const addToCart = () => {
  if (!currentProduct.value) return;
  if (availableColors.value.length && !selectedColor.value) {
    toast.error("Please select a color.");
    return;
  }
  if (availableSizes.value.length && !selectedSize.value) {
    toast.error("Please select a size.");
    return;
  }

  cart.addToCart(
    {
      ...(currentProduct.value as any),
      selectedColor: selectedColor.value,
      selectedSize: selectedSize.value,
    },
    qty.value,
  );
  toast.success(`${currentProduct.value.title} has been added to your cart`);
};

const toggleWishlist = () => {
  if (!currentProduct.value) return;
  wishlist.toggle(currentProduct.value as any);
  toast.success(
    `${currentProduct.value.title} has been ${wishlist.items.hasOwnProperty(currentProduct.value._id) ? "removed from" : "added to"} your wishlist`,
  );
};
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb">
        <NuxtLink to="/">Product</NuxtLink><span>/</span
        ><span>{{ currentProduct?.category }}</span
        ><span>/</span><strong>{{ currentProduct?.title }}</strong>
      </div>
      <section class="details-grid">
        <div class="thumbs">
          <div v-for="image in currentProduct?.images" class="thumb">
            <img :src="image" />
          </div>
        </div>
        <div class="details-main-img">
          <img :src="currentProduct?.thumbnail" class="" />
        </div>
        <aside class="details-panel">
          <h1>{{ currentProduct?.title }}</h1>
          <div class="rating details-rating">
            <span class="stars">★★★★★</span><span>(150 Reviews)</span
            ><span>|</span><span class="stock">In Stock</span>
          </div>
          <div class="details-price">${{ currentProduct?.price }}</div>
          <p>{{ currentProduct?.description }}</p>
          <hr class="soft-rule" />
          <div v-if="availableColors.length" class="swatches">
            <span>Colours:</span>
            <button
              v-for="color in availableColors"
              :key="color"
              type="button"
              class="swatch"
              :class="{ active: selectedColor === color }"
              :style="{ background: color }"
              :aria-label="`Select color ${color}`"
              @click="selectedColor = color"
            ></button>
          </div>
          <div v-if="availableSizes.length" class="sizes">
            <span>Size:</span>
            <button
              v-for="size in availableSizes"
              :key="size"
              type="button"
              class="size"
              :class="{ active: selectedSize === size }"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
          <div class="buy-row">
            <div class="stepper">
              <button @click="decrease">-</button>
              <span>{{ qty }}</span>
              <button class="stepper-plus" @click="increase">+</button>
            </div>
            <button class="btn compact-btn" @click="addToCart">
              Add To Cart
            </button>
            <button
              class="btn outline compact-icon-btn"
              @click="toggleWishlist"
            >
              ♡
            </button>
          </div>
          <div class="delivery-box">
            <div>
              <strong class="delivery-icon">↯</strong>
              <p>
                <strong>Free Delivery</strong><br /><small
                  >Enter your postal code for Delivery Availability</small
                >
              </p>
            </div>
            <div>
              <strong class="delivery-icon">↩</strong>
              <p>
                <strong>Return Delivery</strong><br /><small
                  >Free 30 Days Delivery Returns. Details</small
                >
              </p>
            </div>
          </div>
        </aside>
      </section>
      <section class="related-products">
        <SectionHeader eyebrow="Related Item" title="" />
        <ProductGrid
          :products="similarProducts"
          layout="row"
          title=""
          eyebrow="Related Item"
          :loading="relatedProductsLoading"
          :skeleton-count="4"
        />
      </section>
    </div>
  </NuxtLayout>
</template>
