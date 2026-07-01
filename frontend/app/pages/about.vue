<script setup lang="ts">
import Services from '~/components/Services.vue';

const teamMembers = [
  {
    id: 1,
    name: "Tom Cruise",
    role: "Founder & Chairman",
    image: "/assets/tom.png",
  },
  {
    id: 2,
    name: "Emma Watson",
    role: "Managing Director",
    image: "/assets/emma.png",
  },
  {
    id: 3,
    name: "Will Smith",
    role: "Product Designer",
    image: "/assets/will.png",
  },
  {
    id: 4,
    name: "John Doe",
    role: "Marketing Head",
    image: "/assets/tom.png",
  },
  {
    id: 5,
    name: "Sarah Lee",
    role: "UI Designer",
    image: "/assets/emma.png",
  },
];

</script>
<template>
  <NuxtLayout>
    <div class="container page-gap">
      <div class="breadcrumb"><NuxtLink to="/">Home</NuxtLink><span>/</span><strong>About</strong></div>
      <section class="about-hero">
        <div>
          <h1>Our Story</h1>
          <p>Launced in 2015, Exclusive is South Asia’s premier online shopping makterplace with an active presense in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sallers and 300 brands and serves 3 millioons customers across the region.</p>
          <p>Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assotment in categories ranging from consumer.</p>
        </div>
        <div class="about-image">
          <img src="/assets/ourstory.png" alt="About Exclusive">
        </div>
      </section>
      <section class="stats">
        <div class="stat"><div>
           <div class="service-icon">
            <div class="service-icon-inner"><img src="/assets/sellers.svg" /></div>
          </div>
          <h2>10.5k</h2><p>Sallers active our site</p></div></div>
        <div class="stat active"><div>
           <div class="service-icon">
            <div class="service-icon-inner"><img src="/assets/dollar.svg" /></div>
          </div><h2>33k</h2><p>Monthly Produduct Sale</p></div></div>
        <div class="stat"><div>
           <div class="service-icon">
            <div class="service-icon-inner"><img src="/assets/shoppingbag.svg" /></div>
          </div><h2>45.5k</h2><p>Customer active in our site</p></div></div>
        <div class="stat"><div> <div class="service-icon">
            <div class="service-icon-inner"><img src="/assets/moneybag.svg" /></div>
          </div><h2>25k</h2><p>Anual gross sale in our site</p></div></div>
      </section>
      <section class="team-section">
  <ProductSlider
    :items="teamMembers"
    layout="row"
    :slides-per-view="3"
    :space-between="30"
    :pagination="true"
    :navigation="false"
    :loop="true"
    :breakpoints="{
      0:{slidesPerView: 1,spaceBetween:0},
      768:{slidesPerView: 2,spaceBetween:30},
      1024:{slidesPerView: 3,spaceBetween:30},

    }"
  >
    <template #item="{ item }">
      <article class="team-card">
        <div class="team-photo">
          <img :src="item.image" :alt="item.name" />
        </div>

        <h3>{{ item.name }}</h3>

        <p class="team-role">
          {{ item.role }}
        </p>

        <div class="team-socials">
          <a href="#">
            <img src="/assets/twitter.svg" height=24 width=24/>
          </a>

          <a href="#">
            <img src="/assets/instagram.svg"height="24" width="24" />
          </a>

          <a href="#">
            <img src="/assets/linkedin.svg" height="24" width="24"/>
          </a>
        </div>
      </article>
    </template>
  </ProductSlider>
</section>
     
    <Services/>
    </div>
  </NuxtLayout>
</template>
<style scoped>
.base-slider :deep(.swiper-pagination) {
  position: static;
  margin-top: 40px;
}

.base-slider :deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: #808080;
  opacity: 0.4;
}

.base-slider :deep(.swiper-pagination-bullet-active) {
  background: #db4444;
  opacity: 1;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #db4444;
}
.team-socials{
  display: flex;
  gap: 8px;
}
</style>

