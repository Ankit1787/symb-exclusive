<script setup lang="ts">
import { browseCategories, categories } from "~/data/catalog";
import ProductSlider from "~/components/ProductSlider.vue";
const productStore = useProductStore();
const saleEndsAt = "2026-12-31T23:59:59";
const bannerEndsAt = "2026-07-01T23:59:59";
const {
  products,
  similarProducts,
  bestSellers,
  saleProducts,
  newArrivals,
  productsLoading,
  bestSellerLoading,
  flashSaleLoading,
} = storeToRefs(productStore);
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
          <NuxtLink
            v-for="cat in categories"
            :key="cat"
            :to="`/collection/${cat}`"
          >
            <span>{{ cat }}</span
            ><span v-if="cat.includes('Fashion')">›</span>
          </NuxtLink>
        </aside>
        <div class="hero-banner">
          <ProductSlider
            v-if="!flashSaleLoading && saleProducts.length"
            :items="saleProducts"
            :slides-per-view="1"
            :space-between="0"
            :breakpoints="{
              0: { slidesPerView: 1, spaceBetween: 0 },
              480: { slidesPerView: 1, spaceBetween: 0 },
              768: { slidesPerView: 1, spaceBetween: 0 },
              1024: { slidesPerView: 1, spaceBetween: 0 },
              1280: { slidesPerView: 1, spaceBetween: 0 },
            }"
            :navigation="true"
            :pagination="true"
            :loop="true"
            :autoplay="{ delay: 4000 }"
          >
            <template #item="{ item }">
              <div class="hero-slide">
                <div class="hero-copy">
                  <p>{{ item.subtitle ?? "Featured" }}</p>
                  <h1>{{ item.title ?? item.name ?? item.title }}</h1>
                  <NuxtLink
                    class="hero-link"
                    :to="`/product/${item._id || item.id}`"
                    >Shop Now <span>→</span></NuxtLink
                  >
                  <CountdownTimer
                    class="banner-countdown"
                    :end-date="bannerEndsAt"
                    compact
                  />
                </div>
                <div class="hero-phone">
                  <img
                    :src="item.image ?? item.thumbnail ?? item.images?.[0]"
                    alt=""
                  />
                </div>
              </div>
            </template>
          </ProductSlider>
          <div v-else class="hero-slide hero-slide-skeleton" aria-hidden="true">
            <div class="hero-copy">
              <div class="hero-skeleton-line hero-skeleton-eyebrow"></div>
              <div class="hero-skeleton-line hero-skeleton-title"></div>
              <div class="hero-skeleton-line hero-skeleton-title short"></div>
              <div class="hero-skeleton-line hero-skeleton-link"></div>
            </div>
            <div class="hero-phone hero-phone-skeleton"></div>
          </div>
        </div>
      </section>

      <section class="page-gap">
       
        <ProductGrid
          :products="saleProducts"
          layout="row"
          title="Flash Sales"
          eyebrow="Today’s"
          :loading="flashSaleLoading"
          :skeleton-count="4"
        />
        <div class="center-action">
          <NuxtLink class="btn" to="/collection/sale"
            >View All Products</NuxtLink
          >
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Categories" title="Browse By Category" />
        <div class="category-grid">
          <NuxtLink
            v-for="(cat, index) in browseCategories"
            :key="cat.name"
            class="category-tile"
            :class="{ active: index === 3 }"
            to="/category-dropdown"
          >
            <img :src="cat.image" :alt="cat.name" class="category-icon" />
            <span>{{ cat.name }}</span>
          </NuxtLink>
        </div>
      </section>

      <section class="page-gap">
        <ProductGrid
          :products="bestSellers"
          layout="row"
          eyebrow="This Month"
          title="Best Selling Products"
          action="View All"
          link="/collection/bestseller"
          :loading="bestSellerLoading"
          :skeleton-count="4"
        />
      </section>

      <section class="promo">
        <div>
          <p class="green-label">Categories</p>
          <h2>Enhance Your Music Experience</h2>
          <CountdownTimer :end-date="saleEndsAt" />
          <NuxtLink class="btn green" to="/product-details">Buy Now!</NuxtLink>
        </div>
        <div class="speaker">
          <img src="/assets/jbl.png" />
        </div>
      </section>

      <section class="page-gap">
        <div class="">
          <ProductGrid
            :products="products"
            layout="grid"
            eyebrow="Our Products"
            title="Explore Our Products"
            :loading="productsLoading"
            :skeleton-count="8"
          />
        </div>
        <div class="center-action">
          <NuxtLink class="btn" to="/collection/all"
            >View All Products</NuxtLink
          >
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Featured" title="New Arrival" />
        <div class="feature-grid">
          <div class="feature-main feature-ps5">
            <img src="/assets/ps.png" class="feature-main-image" alt="PlayStation 5" />
            <div class="feature-content">
              <h3>PlayStation 5</h3>
              <p>Black and White version of the PS5 coming out on sale.</p>
              <NuxtLink class="hero-link" to="/product-details"
                >Shop Now</NuxtLink
              >
            </div>
          </div>
          <div class="feature-side">
            <div class="feature-small feature-women"> 
              <img src="/assets/women.png" class="newarrival-image feature-women" alt="Women’s Collections" />

              <div class="feature-content">
                <h3>Women’s Collections</h3>
                <p>Featured woman collections that give you another vibe.</p>
                <NuxtLink class="hero-link" to="/category-dropdown"
                  >Shop Now</NuxtLink
                >
              </div>
            </div>
            <div class="feature-row">
              <div class="feature-small feature-speaker">
                <img src="/assets/speakers.png" class="newarrival-image" alt="Speakers" />

                <div class="feature-content">
                  <h3>Speakers</h3>
                  <p>Amazon wireless speakers</p>
                  <NuxtLink class="hero-link" to="/product-details"
                    >Shop Now</NuxtLink
                  >
                </div>
              </div>
              <div class="feature-small feature-perfume">
                <img src="/assets/perfume.png" class="newarrival-image" alt="Perfume" />
                <div class="feature-content">
                  <h3>Perfume</h3>
                  <p>GUCCI INTENSE OUD EDP</p>
                  <NuxtLink class="hero-link" to="/product-details"
                    >Shop Now</NuxtLink
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="services">
        <div>
          <div class="service-icon"><img src="/assets/fastdelivery.svg"/></div>
          <h3>FREE AND FAST DELIVERY</h3>
          <p>Free delivery for all orders over $140</p>
        </div>
        <div>
          <div class="service-icon"><img src="/assets/customercare.svg"/></div>
          <h3>24/7 CUSTOMER SERVICE</h3>
          <p>Friendly 24/7 customer support</p>
        </div>
        <div>
          <div class="service-icon"><img src="/assets/moneybag.svg"/></div>
          <h3>MONEY BACK GUARANTEE</h3>
          <p>We return money within 30 days</p>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>
