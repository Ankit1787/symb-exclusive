<script setup lang="ts">
import { products } from '~/data/catalog'

const product = products[0]
</script>

<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb"><NuxtLink to="/">Account</NuxtLink><span>/</span><span>Gaming</span><span>/</span><strong>Havic HV G-92 Gamepad</strong></div>
      <section class="details-grid">
        <div class="thumbs">
          <div v-for="n in 4" :key="n" class="thumb"><span class="product-art art-gamepad thumb-art" /></div>
        </div>
        <div class="details-main-img"><span class="product-art art-gamepad detail-art" /></div>
        <aside class="details-panel">
          <h1>Havic HV G-92 Gamepad</h1>
          <div class="rating details-rating"><span class="stars">★★★★★</span><span>(150 Reviews)</span><span>|</span><span class="stock">In Stock</span></div>
          <div class="details-price">$192.00</div>
          <p>PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.</p>
          <hr class="soft-rule" />
          <div class="swatches"><span>Colours:</span><span class="swatch"></span><span class="swatch swatch-red"></span></div>
          <div class="sizes"><span>Size:</span><span class="size">XS</span><span class="size">S</span><span class="size active">M</span><span class="size">L</span><span class="size">XL</span></div>
          <div class="buy-row">
            <div class="stepper"><button>-</button><span>2</span><button class="stepper-plus">+</button></div>
            <button class="btn compact-btn">Buy Now</button>
            <button class="btn outline compact-icon-btn">♡</button>
          </div>
          <div class="delivery-box">
            <div><strong class="delivery-icon">↯</strong><p><strong>Free Delivery</strong><br /><small>Enter your postal code for Delivery Availability</small></p></div>
            <div><strong class="delivery-icon">↩</strong><p><strong>Return Delivery</strong><br /><small>Free 30 Days Delivery Returns. Details</small></p></div>
          </div>
        </aside>
      </section>
      <section class="related-products">
        <SectionHeader eyebrow="Related Item" title="" />
        <!-- <ProductGrid :count="4" /> -->
      </section>
    </div>
  </NuxtLayout>
</template>
