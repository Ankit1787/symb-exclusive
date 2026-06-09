<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { toast } from "vue-sonner";
import type { Product } from "~/types/product";

// useCartStore and useWishlistStore are auto-imported by Nuxt/Pinia

const props = defineProps<{
  product: Product;
}>();

const cart = useCartStore();
const wishlist = useWishlistStore();
const showVariants = ref(false);
const qty = ref(1);

const isAdding = ref(false);
const isWishing = ref(false);
const isViewing = ref(false);



const availableColors = computed(() => {
  const colors = props.product.variants.map(v => v.color);

  return Array.from(
    new Map(
      colors.map(color => [color.code, color])
    ).values()
  );
});

const availableSizes = computed(() => {
  if (!activeColor.value) return [];

  return [
    ...new Set(
      props.product.variants
        .filter(v => v.color.code === activeColor.value)
        .map(v => v.size)
    ),
  ];
});

const activeColor = ref<string>("");
const activeSize = ref<string>("");

const cartItem = computed(() => {
  return cart.items.find((item) => item.product?._id === props.product._id);
});
const isInCart = computed(() => !!cartItem.value);

onMounted(() => {
  const firstVariant =
    props.product.variants.find(v => v.stock > 0) ??
    props.product.variants[0];

  if (!firstVariant) return;

  activeColor.value = firstVariant.color.code;
  activeSize.value = firstVariant.size;

});


const selectColor = (colorCode: string) => {
  activeColor.value = colorCode;

  const firstSize =
    props.product.variants.find(
      v =>
        v.color.code === colorCode &&
        v.stock > 0
    ) ??
    props.product.variants.find(
      v => v.color.code === colorCode
    );

  if (firstSize) {
    activeSize.value = firstSize.size;
  }
};
const selectedVariant = computed(() => {
  return props.product.variants.find(
    v =>
      v.color.code === activeColor.value &&
      v.size === activeSize.value
  );
});



const increaseQty = () => {
  qty.value++;
};
const decreaseQty = () => {
  qty.value = Math.max(1, qty.value - 1);
};
const addToCart = async () => {

  if (!props.product || isAdding.value) return;
  isAdding.value = true;
  await new Promise((r) => setTimeout(r, 260));


  cart.addToCart(props.product as any, qty.value, selectedVariant.value as any);
  toast.success(`${props.product.title} has been added to your cart`);
  isAdding.value = false;
};

const toggleWishlist = async () => {
  if (!props.product || isWishing.value) return;
  isWishing.value = true;
  const wasInWishlist = wishlist.contains(props.product._id);
  // tiny delay for UX
  await new Promise((r) => setTimeout(r, 200));
  wishlist.toggle(props.product);
  toast.success(
    `${props.product.title} has been ${wasInWishlist ? "removed from" : "added to"} your wishlist`,
  );
  isWishing.value = false;
};

const isInWishlist = computed(() => wishlist.contains(props.product._id));
const emit = defineEmits<{
  quickView: [Product]
}>();

const handleView = () => {
  if (isViewing.value) return;
  isViewing.value = true;
  // short visual feedback
  setTimeout(() => (isViewing.value = false), 260);
  emit("quickView", props.product);
};
</script>

<template>
  <article class="product-card">
    <div class="product-media">
      <NuxtLink :to="`/product/${product._id}`" class="product-media-link">
        <img :src="product.thumbnail" alt="product image" loading="lazy" class="product-card-img" />
      </NuxtLink>
      <span class="discount">-{{ Math.round(product.discountPercentage) }}%</span>

      <!-- Cart controls overlay if in cart -->
      <div v-if="isInCart || showVariants" class="cart-controls" @click.stop.prevent>
        <div class="controls-top">
          <!-- Colors -->
          <div class="color-options">

            <button v-for="color in availableColors" :key="color.code" :style="{ backgroundColor: color.code }"
              type="button" class="color-dot" :class="{ active: activeColor === color.code }"
              @click="selectColor(color.code)" />
          </div>
          <!-- Sizes -->
          <div class="size-options">

            <button v-for="size in availableSizes" :key="size" class="size-tag" :class="{ active: activeSize === size }"
              @click.stop.prevent="activeSize = size">
              {{ size }}
            </button>
          </div>
        </div>
        <!-- Quantity Stepper -->
        <div class="actions">
          <div class="stepper-row">
            <button class="step-btn" @click="decreaseQty" aria-label="Decrease quantity">-</button>
            <span class="qty-display">{{ qty}}</span>
            <button class="step-btn" @click="increaseQty" aria-label="Increase quantity">+</button>
          </div>
          <button @click.stop.prevent="addToCart" :disabled="isAdding"
            :class="['add-btn', { 'btn--adding': isAdding }]">
            Add
          </button>
        </div>

      </div>

      <!-- Add to cart overlay if not in cart -->
      <button v-else @click.stop.prevent="showVariants = true" :disabled="isAdding"
        :class="['add-cart', { 'btn--adding': isAdding }]">
        Add To Cart
      </button>
    </div>
    <!-- <span v-if="product.tag" class="tag">{{ product.tag }}</span> -->
    <span class="card-tools">
      <span @click.stop="toggleWishlist" :class="['cart-icon', { 'wish--toggling': isWishing }]">
        <img :src="isInWishlist
          ? '/assets/heart-fill-small.svg'
          : '/assets/heart-small.svg'
          " alt="Wishlist" />
      </span>
      <span @click.stop="handleView" :class="['cart-icon', { 'view--anim': isViewing }]">
        <img src="/assets/view.svg" />
      </span>
    </span>
    <!-- <span class="product-art" :class="`art-${product.}`" /> -->

    <h3>{{ product.title }}</h3>
    <div>
      <span class="price">${{ product.price }}</span>
      <span v-if="product.mrp" class="old-price">${{ product.mrp }}</span>
    </div>
    <div class="rating">
      <span class="stars">★★★★★</span>
      <!-- <span>({{ product.reviews }})</span> -->
    </div>
  </article>
</template>

<style scoped>
/* Add Cart button styling (matching Quick View) */
.add-cart.btn {
  padding: 10px 14px;
  background: #DB4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
}

.add-cart.btn:active {
  transform: scale(0.98);
}

.add-cart.btn[disabled] {
  opacity: 0.85;
  cursor: default;
}

.btn--adding {
  border-color: #2fa84f !important;
  background: #2fa84f !important;
  box-shadow: 0 6px 18px rgba(47, 168, 79, 0.18);
  color: #fff;
}



/* Wishlist toggle feedback */
.wish--toggling {
  transform: scale(1.08);
  transition: transform 160ms ease;
}

/* View icon feedback */
.view--anim {
  transform: scale(1.06);
  transition: transform 160ms ease;
}

/* Ensure cart-icon spacing remains consistent */
.card-tools .cart-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Cart Controls Hover Panel */
.cart-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #e2bebb;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transform: translateY(100%);
  transition: transform 0.18s ease;
  z-index: 12;
}

.product-card:hover .cart-controls {
  transform: translateY(0);
}

.controls-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
}

.color-options {
  display: flex;
}

.color-dot {
  width: 16px;
  height: 16px;
  margin-right: 15px;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s ease, border-color 0.15s ease;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  background: #a0bce0;
  box-shadow: 0 0 0 2px #fff,
    0 0 0 3px #000;
}

.color-dot.active {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

.size-options {
  display: flex;
  gap: 4px;
}

.size-tag {
  font-size: 12px;
  border: 1px solid #8e706e;
  background: transparent;
  color: #181c1f;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.size-tag.active {
  background-color: #db4444;
  color: #ffffff;
  border-color: #db4444;
}

.add-btn {
  background-color: #db4444;
  color: #ffffff;
  border-color: #db4444;
  width: 100px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
}

.stepper-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  border-radius: 4px;
  height: 32px;
  padding: 0 8px;
  width: 100%;
}

.step-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #181c1f;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  transition: color 0.15s ease;
}

.step-btn:hover {
  color: #db4444;
}

.qty-display {
  font-size: 13px;
  font-weight: 700;
  color: #181c1f;
}

.product-media-link {
  display: flex;
  width: 100%;
  height: 100%;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
