<script setup lang="ts">
import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import type { Product } from "~/types/product";

// useCartStore and useWishlistStore are auto-imported by Nuxt/Pinia

const props = defineProps<{
  product: Product;
}>();

const cart = useCartStore();
const wishlist = useWishlistStore();

const qty = ref(1);

const isAdding = ref(false);
const isWishing = ref(false);
const isViewing = ref(false);

const addToCart = async () => {
  if (!props.product || isAdding.value) return;
  isAdding.value = true;
  await new Promise((r) => setTimeout(r, 260));
  cart.addToCart(props.product as any, qty.value);
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
  quickView:[Product]
}>()

const handleView = () => {
  if (isViewing.value) return;
  isViewing.value = true;
  // short visual feedback
  setTimeout(() => (isViewing.value = false), 260);
  emit("quickView", props.product);
}
</script>

<template>
  <article class="product-card">
    <NuxtLink :to="`/product/${product._id}`" class="product-media">
      <img
        :src="product.thumbnail"
        alt="product image"
        class="product-card-img"
      />
      <span class="discount"
        >-{{ Math.round(product.discountPercentage) }}%</span
      >
      <button @click.stop.prevent="addToCart" :disabled="isAdding" :class="['add-cart', 'btn', { 'btn--adding': isAdding }]">Add To Cart</button>
    </NuxtLink>
    <!-- <span v-if="product.tag" class="tag">{{ product.tag }}</span> -->
    <span class="card-tools">
      <span @click.stop="toggleWishlist" :class="['cart-icon', { 'wish--toggling': isWishing }]">
        <img
          :src="
            isInWishlist
              ? '/assets/heart-fill-small.svg'
              : '/assets/heart-small.svg'
          "
          alt="Wishlist"
        />
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
.add-cart.btn:active { transform: scale(0.98); }
.add-cart.btn[disabled] { opacity: 0.85; cursor: default; }
.btn--adding {
  background: #2fa84f !important;
  box-shadow: 0 6px 18px rgba(47,168,79,0.18);
  color: #fff;
}

/* Wishlist toggle feedback */
.wish--toggling { transform: scale(1.08); transition: transform 160ms ease; }

/* View icon feedback */
.view--anim { transform: scale(1.06); transition: transform 160ms ease; }

/* Ensure cart-icon spacing remains consistent */
.card-tools .cart-icon { display: inline-flex; align-items: center; justify-content: center; }
</style>
