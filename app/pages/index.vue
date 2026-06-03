<script setup lang="ts">
import { browseCategories, categories } from '~/data/catalog'
const productStore = useProductStore();
const {products,similarProducts,bestSellers,saleProducts,newArrivals}=storeToRefs(productStore)
await productStore.fetchProducts();

await productStore.fetchProductsByCollection("best-seller");
await productStore.fetchProductsByCollection("new-arrival");
await productStore.fetchProductsByCollection("flash-sale");
await productStore.fetchProductsByCollection("featured");


</script>

<template>
  <NuxtLayout>
    <div class="container">
      <section class="home-hero">
        <aside class="side-cats">
          <NuxtLink v-for="cat in categories" :key="cat" :to="`/collection/${cat}`">
            <span>{{ cat }}</span><span v-if="cat.includes('Fashion')">›</span>
          </NuxtLink>
        </aside>
        <div class="hero-banner">
          <div class="hero-copy">
            <p> iPhone 14 Series</p>
            <h1>Up to 10% off Voucher</h1>
            <NuxtLink class="hero-link" to="/product-details">Shop Now <span>→</span></NuxtLink>
          </div>
          <div class="hero-phone" />
        </div>
      </section>

      <section class="page-gap">
        <SectionHeader eyebrow="Today’s" title="Flash Sales" />
        <ProductGrid  :products="saleProducts" layout="row"/>
        <div class="center-action"><NuxtLink class="btn" to="/collection/sale">View All Products</NuxtLink></div>
      </section>

      <section>
        <SectionHeader eyebrow="Categories" title="Browse By Category" />
        <div class="category-grid">
          <NuxtLink v-for="(cat, index) in browseCategories" :key="cat.name" class="category-tile" :class="{ active: index === 3 }" to="/category-dropdown">
            <img :src="cat.image" :alt="cat.name" class="category-icon" /> 
            <span>{{ cat.name }}</span>
          </NuxtLink>
        </div>
      </section>

      <section class="page-gap">
        <SectionHeader eyebrow="This Month" title="Best Selling Products" action="View All" link="/collection/bestseller" />
        <ProductGrid :products="bestSellers" layout="row" />
      </section>

      <section class="promo">
        <div>
          <p class="green-label">Categories</p>
          <h2>Enhance Your Music Experience</h2>
          <div class="timer">
            <div><span><strong>23</strong>Hours</span></div>
            <div><span><strong>05</strong>Days</span></div>
            <div><span><strong>59</strong>Minutes</span></div>
            <div><span><strong>35</strong>Seconds</span></div>
          </div>
          <NuxtLink class="btn green" to="/product-details">Buy Now!</NuxtLink>
        </div>
        <div class="speaker" />
      </section>

      <section class="page-gap">
        <SectionHeader eyebrow="Our Products" title="Explore Our Products" />
        <div class="">
        <ProductGrid :products="products" layout="grid" />
        
        </div>
        <div class="center-action"><NuxtLink class="btn" to="/collection/all">View All Products</NuxtLink></div>
      </section>

      <section>
        <SectionHeader eyebrow="Featured" title="New Arrival" />
        <div class="feature-grid">
          <div class="feature-main">
            <div class="feature-content">
              <h3>PlayStation 5</h3>
              <p>Black and White version of the PS5 coming out on sale.</p>
              <NuxtLink class="hero-link" to="/product-details">Shop Now</NuxtLink>
            </div>
          </div>
          <div class="feature-side">
            <div class="feature-small">
              <div class="feature-content">
                <h3>Women’s Collections</h3>
                <p>Featured woman collections that give you another vibe.</p>
                <NuxtLink class="hero-link" to="/category-dropdown">Shop Now</NuxtLink>
              </div>
            </div>
            <div class="feature-row">
              <div class="feature-small"><div class="feature-content"><h3>Speakers</h3><p>Amazon wireless speakers</p><NuxtLink class="hero-link" to="/product-details">Shop Now</NuxtLink></div></div>
              <div class="feature-small"><div class="feature-content"><h3>Perfume</h3><p>GUCCI INTENSE OUD EDP</p><NuxtLink class="hero-link" to="/product-details">Shop Now</NuxtLink></div></div>
            </div>
          </div>
        </div>
      </section>

      <section class="services">
        <div><div class="service-icon">↯</div><h3>FREE AND FAST DELIVERY</h3><p>Free delivery for all orders over $140</p></div>
        <div><div class="service-icon">☏</div><h3>24/7 CUSTOMER SERVICE</h3><p>Friendly 24/7 customer support</p></div>
        <div><div class="service-icon">✓</div><h3>MONEY BACK GUARANTEE</h3><p>We return money within 30 days</p></div>
      </section>
    </div>
  </NuxtLayout>
</template>
