<script setup lang="ts">
import { toast } from "vue-sonner";
import type { Product } from "~/types/product";

// useCartStore and useWishlistStore are auto-imported by Nuxt/Pinia

const props = defineProps<{
  product: Product;
}>();

const cart = useCartStore();
const wishlist = useWishlistStore();

const qty = ref(1);

const addToCart = () => {
  if (!props.product) return;
  cart.addToCart(props.product as any, qty.value);
  toast.success(
    `${props.product.title} has been ${wishlist.items.hasOwnProperty(props.product._id) ? "removed from" : "added to"} your cart`,
  );
};

const toggleWishlist = () => {
  if (!props.product) return;

  const wasInWishlist = wishlist.contains(props.product._id);

  wishlist.toggle(props.product);

  toast.success(
    `${props.product.title} has been ${
      wasInWishlist ? "removed from" : "added to"
    } your wishlist`,
  );
};
const isInWishlist = computed(() => wishlist.contains(props.product._id));
</script>

<template>
  <article class="product-card">
    <NuxtLink :to="`/product/${product._id}`" class="product-media">
      <img
        :src="product.thumbnail"
        alt="product image"
        class="product-card-img"
      />
      <span class="discount">-{{ Math.round(product.discountPercentage) }}%</span>
      <button @click="addToCart" class="add-cart">Add To Cart</button>
    </NuxtLink>
    <!-- <span v-if="product.tag" class="tag">{{ product.tag }}</span> -->
    <span class="card-tools">
      <span @click.stop="toggleWishlist" class="cart-icon">
        <img
          :src="
            isInWishlist
              ? '/assets/heart-fill-small.svg'
              : '/assets/heart-small.svg'
          "
          alt="Wishlist"
        />
      </span>
      <span class="cart-icon"><img src="/assets/quick-view.svg" /></span>
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
