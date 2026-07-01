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

const selectedImage = ref("");

watch(
  () => currentProduct.value,
  (product) => {
    if (product) {
      selectedImage.value =
        product.images?.[0] ??
        product.thumbnail ??
        "";
    }
  },
  { immediate: true }
);

const selectImage = (image: string) => {
  selectedImage.value = image;
};

const activeColor = ref<string>("");
const activeSize = ref<string>("");

const cartItem = computed(() => {
  return cart.items.find((item) => item.product?._id === currentProduct.value?._id);
});
const isInCart = computed(() => !!cartItem.value);

onMounted(() => {
  const firstVariant =
    currentProduct.value?.variants.find(v => v.stock > 0) ??
    currentProduct.value?.variants[0];

  if (!firstVariant) return;

  activeColor.value = firstVariant.color.code;
  activeSize.value = firstVariant.size;

});


const selectColor = (colorCode: string) => {
  activeColor.value = colorCode;

  const firstSize =
    currentProduct.value?.variants.find(
      v =>
        v.color.code === colorCode &&
        v.stock > 0
    ) ??
    currentProduct.value?.variants.find(
      v => v.color.code === colorCode
    );
    console.log("cleicked")

  if (firstSize) {
    activeSize.value = firstSize.size;
  }
};

const selectedVariant = computed(() => {
  return currentProduct.value?.variants.find(
    v =>
      v.color.code === activeColor.value &&
      v.size === activeSize.value
  );
});


const availableColors = computed(() => {
  const colors =  currentProduct.value?.variants.map(v => v.color);

  return Array.from(
    new Map(
      colors?.map(color => [color.code, color])
    ).values()
  );
});

const availableSizes = computed(() => {
  if (!activeColor.value) return [];

  return [
    ...new Set(
        currentProduct.value?.variants
        .filter(v => v.color.code === activeColor.value)
        .map(v => v.size)
    ),
  ];
});


const increase = () => {
  qty.value++;
};
const decrease = () => {
  qty.value = Math.max(1, qty.value - 1);
};

const addToCart = () => {
  if (!currentProduct.value|| !selectedVariant.value) return;
  if (availableColors.value.length && !activeColor.value) {
    toast.error("Please select a color.");
    return;
  }
  if (availableSizes.value.length && !activeSize.value) {
    toast.error("Please select a size.");
    return;
  }

  cart.addToCart(
    {
      ...(currentProduct.value as any),

    },
    qty.value,
    selectedVariant.value,

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
          <button
            v-for="image in currentProduct?.images"
            :key="image"
            class="thumb"
            :class="{ active: selectedImage === image }"
            @click="selectImage(image)"
            type="button"
          >
            <img :src="image" />
          </button>
        </div>
        <div class="details-main-img">
          <img :src="selectedImage || currentProduct?.thumbnail" class="" />
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
              :key="color.code"
              type="button"
              class="swatch"
              :class="{ active: activeColor === color.code }"
              :style="{ background: color.code }"
              :aria-label="`Select color ${color.code}`"
 @click="selectColor(color.code)"     
         ></button>

          </div>
          <div v-if="availableSizes.length" class="sizes">
            <span>Size:</span>
            <button
              v-for="size in availableSizes"
              :key="size"
              type="button"
              class="size"
              :class="{ active: activeSize === size }"
              @click="activeSize = size"
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
