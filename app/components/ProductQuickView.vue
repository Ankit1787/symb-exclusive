<script setup lang="ts">
import type { Product } from "~/types/product";
import { computed, ref, watch } from "vue";
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
const activeColor = ref<string>("");
const activeSize = ref<string>("");

watch(
  () => props?.product,
  (product) => {
    selectedImage.value =
      product?.images?.[0] ??
      product?.thumbnail ??
      "";

    const firstVariant =
      product?.variants?.find((variant) => variant.stock > 0) ??
      product?.variants?.[0];

    activeColor.value = firstVariant?.color.code ?? "";
    activeSize.value = firstVariant?.size ?? "";
  },
  { immediate: true }
);

const selectImage = (image: string) => {
  selectedImage.value = image;
};

// Cart
const cart = useCartStore();

const availableColors = computed(() => {
  const colors = props.product?.variants?.map((variant) => variant.color) ?? [];

  return Array.from(new Map(colors.map((color) => [color.code, color])).values());
});

const availableSizes = computed(() => {
  if (!props.product || !activeColor.value) return [];

  return [
    ...new Set(
      props.product.variants
        .filter((variant) => variant.color.code === activeColor.value)
        .map((variant) => variant.size),
    ),
  ];
});

const selectedVariant = computed(() => {
  return props.product?.variants.find(
    (variant) =>
      variant.color.code === activeColor.value &&
      variant.size === activeSize.value,
  );
});

const selectColor = (colorCode: string) => {
  activeColor.value = colorCode;

  const firstSize =
    props.product?.variants.find(
      (variant) => variant.color.code === colorCode && variant.stock > 0,
    ) ??
    props.product?.variants.find((variant) => variant.color.code === colorCode);

  activeSize.value = firstSize?.size ?? "";
};

const addToCart = async () => {
  if (!props?.product || isAdding.value) return;
  if (availableColors.value.length && !activeColor.value) {
    toast.error("Please select a color.");
    return;
  }
  if (availableSizes.value.length && !activeSize.value) {
    toast.error("Please select a size.");
    return;
  }
  if (!selectedVariant.value) {
    toast.error("Selected option is unavailable.");
    return;
  }

  isAdding.value = true;
  // small animation window so user sees feedback
  await new Promise((res) => setTimeout(res, 260));
  cart.addToCart(props.product as any, 1, selectedVariant.value as any);
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

            <div v-if="availableColors.length" class="option-group">
              <span class="option-label">Colours:</span>
              <div class="swatches">
                <button
                  v-for="color in availableColors"
                  :key="color.code"
                  type="button"
                  class="swatch"
                  :class="{ active: activeColor === color.code }"
                  :style="{ background: color.code }"
                  :aria-label="`Select color ${color.name}`"
                  @click="selectColor(color.code)"
                />
              </div>
            </div>

            <div v-if="availableSizes.length" class="option-group">
              <span class="option-label">Size:</span>
              <div class="sizes">
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
            </div>

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

.option-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.option-label {
  min-width: 66px;
  color: #181c1f;
  font-size: 14px;
  font-weight: 500;
}

.swatches,
.sizes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.swatch {
  width: 22px;
  height: 22px;
  border: 1px solid #b7b7b7;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  margin:0 5px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.swatch.active {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px #fff, 0 0 0 3px #181c1f;
}

.size {
  min-width: 36px;
  height: 32px;
  border: 1px solid #b7b7b7;
  border-radius: 4px;
  background: #fff;
  color: #181c1f;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.size.active {
  background: #db4444;
  border-color: #db4444;
  color: #fff;
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
