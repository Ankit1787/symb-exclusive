<script setup lang="ts">
import type { Product } from "~/types/product";
import { ref, watch } from "vue";
import { toast } from "vue-sonner";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const props=defineProps<{
  product: Product | null;
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const selectedImage = ref("");
const isAdding = ref(false);

watch(
  () => props?.product,
  (product) => {
    selectedImage.value =
      product?.images?.[0] ??
      product?.thumbnail ??
      "";
  },
  { immediate: true }
);

const selectImage = (image: string) => {
  selectedImage.value = image;
};

// Cart
const cart = useCartStore();
const addToCart = async () => {
  if (!props?.product || isAdding.value) return;
  isAdding.value = true;
  // small animation window so user sees feedback
  await new Promise((res) => setTimeout(res, 260));
  cart.addToCart(props.product as any, 1);
  toast.success(`${props.product.title} has been added to your cart`);
  isAdding.value = false;
  emit("close");
};

</script>
<template>
  <Teleport to="body">
    <div
      v-if="open && product"
      class="modal-overlay"
      @click.self="emit('close')"
    >
      <div class="quick-view-modal">
        <button
          class="close-btn"
          @click="emit('close')"
        >
          ✕
        </button>

        <div class="quick-view-content">

          <!-- Thumbnails -->
          <div class="thumbs">
            <button
              v-for="image in product.images"
              :key="image"
              class="thumb-btn"
              :class="{
                active:
                  selectedImage === image
              }"
              @click="selectImage(image)"
            >
              <img
                :src="image"
                class="thumb-image"
              />
            </button>
          </div>

          <!-- Main Image -->
          <div class="main-image-box">
            <img
              :src="selectedImage"
              class="main-image"
            />
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <h2>
              {{ product.title }}
            </h2>

            <div class="price">
              ${{ product.price }}

              <span
                class="old-price"
              >
                ${{ product.mrp }}
              </span>
            </div>

            <p>
              {{ product.description }}
            </p>

            <button :class="['btn', { 'btn--adding': isAdding }]" @click="addToCart" :disabled="isAdding">
              <span class="btn-label">Add To Cart</span>
            </button>

            <NuxtLink
              :to="`/product/${product._id}`"
              class="btn outline"
            >
              View Details
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>
<style lang="css" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0,0,0,.6);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;
}

.quick-view-modal {
  width: 1100px;
  max-width: 95vw;

  background: white;

  border-radius: 12px;

  padding: 24px;

  position: relative;
}

.quick-view-content {
  display: grid;
  grid-template-columns:
    100px
    450px
    1fr;

  gap: 24px;
}

.thumb-slider {
  height: 500px;
}

.thumb-image {
  width: 100%;
  height: 100px;

  object-fit: contain;

  cursor: pointer;

  border: 1px solid #eee;
}

.main-slider {
  width: 100%;
  height: 500px;
}

.main-image {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.price {
  font-size: 24px;
  font-weight: 600;
}

.old-price {
  margin-left: 10px;

  text-decoration: line-through;

  color: #999;
}

.close-btn {
  position: absolute;

  top: 20px;
  right: 20px;

  border: none;
  background: none;

  font-size: 24px;

  cursor: pointer;
}

/* Add To Cart button styles */
.btn {
  padding: 12px 18px;
  background: #DB4444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
  position: relative;
  overflow: hidden;
}
.btn:active { transform: scale(0.98); }
.btn[disabled] { opacity: 0.85; cursor: default; }

.btn--adding {
  background: #2fa84f;
  box-shadow: 0 6px 18px rgba(47,168,79,0.18);
}
.btn--adding .btn-label { opacity: 0; transform: translateY(-4px); }
.btn--adding::after {
  content: "✓";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 16px;
  animation: btn-check 260ms ease forwards;
}

@keyframes btn-check {
  from { transform: scale(0.8); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
</style>