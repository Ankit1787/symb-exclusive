<script setup lang="ts">
import { cartItems } from '~/data/catalog'

const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb"><NuxtLink to="/">Account</NuxtLink><span>/</span><NuxtLink to="/cart">Cart</NuxtLink><span>/</span><strong>Checkout</strong></div>
      <h1 class="section-title checkout-title">Billing Details</h1>
      <div class="checkout-grid">
        <form class="checkout-form">
          <label>First Name* <input class="field" /></label>
          <label>Company Name <input class="field" /></label>
          <label>Street Address* <input class="field" /></label>
          <label>Apartment, floor, etc. (optional) <input class="field" /></label>
          <label>Town/City* <input class="field" /></label>
          <label>Phone Number* <input class="field" /></label>
          <label>Email Address* <input class="field" /></label>
          <label class="checkbox-line"><input type="checkbox" checked /> Save this information for faster check-out next time</label>
        </form>
        <aside>
          <div v-for="item in cartItems" :key="item.id" class="order-line">
            <span class="line-product"><span class="product-art mini-art" :class="`art-${item.art}`" />{{ item.name }}</span>
            <span>${{ item.price * item.qty }}</span>
          </div>
          <div class="total-line"><span>Subtotal:</span><span>${{ total }}</span></div>
          <div class="total-line"><span>Shipping:</span><span>Free</span></div>
          <div class="total-line"><span>Total:</span><span>${{ total }}</span></div>
          <div class="pay-options">
            <label><input type="radio" name="pay" checked /> Bank</label>
            <label><input type="radio" name="pay" /> Cash on delivery</label>
          </div>
          <div class="coupon checkout-coupon">
            <input placeholder="Coupon Code" />
            <button class="btn">Apply Coupon</button>
          </div>
          <button class="btn">Place Order</button>
        </aside>
      </div>
    </div>
  </NuxtLayout>
</template>
