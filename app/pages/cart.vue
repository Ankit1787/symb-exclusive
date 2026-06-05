<script setup lang="ts">
const cartStore = useCartStore();
const { items: cartItems } = storeToRefs(cartStore);
const subtotal = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  ),
);
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb">
        <NuxtLink to="/">Home</NuxtLink><span>/</span><strong>Cart</strong>
      </div>
      <div class="table-card">
        <div class="cart-head">
          <span>Product</span><span>Size/Color</span><span>Price</span><span>Quantity</span
          ><span>Subtotal</span>
        </div>
        <div v-for="item in cartItems" :key="item.product._id" class="cart-row">
          <span class="line-product"
            ><img :src="item.product.thumbnail" class="cart-image" />{{
              item.product.title
            }}
            <button @click="cartStore.remove(item.product._id,item.selectedVariant)" class="del-btn"><img src="/assets/icon-delete.svg" class="" height="24" width="24"/></button>
            </span
          >
          <span>{{ item?.selectedVariant?.size }} / {{ item?.selectedVariant?.color.name }}</span>
          <span>${{ item.product.price  }}</span>
          <div class="qty-box">
            <span>
              {{ String(item.quantity).padStart(2, "0") }}
            </span>

            <div class="qty-controls">
              <button @click="cartStore.increase(item.product._id,item.selectedVariant)">
                <img src="/assets/Drop-Up-Small.svg" height="16" width="16" />
              </button>

              <button @click="cartStore.decrease(item.product._id,item.selectedVariant)">
                <img src="/assets/Drop-Down-Small.svg" height="16" width="16" />
              </button>
            </div>
          </div>
          <span>${{ (item.product.price * item.quantity ).toFixed(2) }}</span>
        </div>
      </div>
      <div class="cart-actions">
        <NuxtLink class="btn outline" to="/">Return To Shop</NuxtLink>
        <button class="btn outline">Update Cart</button>
      </div>
      <div class="cart-bottom">
        <div class="coupon">
          <input placeholder="Coupon Code" />
          <button class="btn">Apply Coupon</button>
        </div>
        <aside class="total-box">
          <h2>Cart Total</h2>
          <div class="total-line">
            <span>Subtotal:</span><span>${{ subtotal }}</span>
          </div>
          <div class="total-line"><span>Shipping:</span><span>Free</span></div>
          <div class="total-line">
            <span>Total:</span><span>${{ subtotal }}</span>
          </div>
          <NuxtLink class="btn total-action" to="/checkout"
            >Procees to checkout</NuxtLink
          >
        </aside>
      </div>
    </div>
  </NuxtLayout>
</template>
