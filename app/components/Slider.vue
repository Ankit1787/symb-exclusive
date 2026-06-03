<template>
  <section class="product-section">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-title">
        <span class="title-accent"></span>
        <h2>{{ title }}</h2>
      </div>

      <!-- Countdown Timer (for flash sale / "Today's" view) -->
      <div v-if="showTimer" class="countdown">
        <div class="time-block">
          <span class="digits">{{ timer.hours }}</span>
          <span class="label">Hours</span>
        </div>
        <span class="sep">:</span>
        <div class="time-block">
          <span class="digits">{{ timer.minutes }}</span>
          <span class="label">Minutes</span>
        </div>
        <span class="sep">:</span>
        <div class="time-block">
          <span class="digits">{{ timer.seconds }}</span>
          <span class="label">Seconds</span>
        </div>
      </div>

      <!-- Nav Arrows -->
      <div class="slider-nav">
        <button class="nav-btn prev" @click="slidePrev" aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button class="nav-btn next" @click="slideNext" aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Swiper Slider -->
    <Swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="16"
      :breakpoints="swiperBreakpoints"
      :grid="layout === 'grid' ? { rows: 2, fill: 'row' } : undefined"
      :navigation="{ prevEl: '.prev', nextEl: '.next' }"
      @swiper="onSwiper"
      class="product-swiper"
      :class="`layout-${layout}`"
    >
      <SwiperSlide v-for="(product, i) in products" :key="i">
        <div
          class="product-card"
          @mouseenter="hoveredCard = i"
          @mouseleave="hoveredCard = null"
        >
          <!-- Badges -->
          <span v-if="product.badge" class="badge" :class="product.badge === 'NEW' ? 'badge-new' : 'badge-sale'">
            {{ product.badge }}
          </span>

          <!-- Image Area -->
          <div class="card-image">
            <img :src="product.image" :alt="product.name" loading="lazy" />

            <!-- Hover Overlay -->
            <div class="card-overlay" :class="{ visible: hoveredCard === i }">
              <button class="overlay-btn add-to-cart">Add To Cart</button>
            </div>

            <!-- Quick actions -->
            <div class="quick-actions">
              <button class="action-btn" title="Wishlist">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <button class="action-btn" title="Quick view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Card Info -->
          <div class="card-info">
            <div class="price-row">
              <span class="price">${{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice }}</span>
            </div>
            <div class="rating">
              <span v-for="s in 5" :key="s" class="star" :class="{ filled: s <= product.rating, half: s === Math.ceil(product.rating) && product.rating % 1 !== 0 }">★</span>
              <span class="review-count">({{ product.reviews }})</span>
            </div>
            <div v-if="product.colors && product.colors.length" class="color-swatches">
              <span
                v-for="(color, ci) in product.colors"
                :key="ci"
                class="swatch"
                :style="{ background: color }"
              ></span>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- View All Button -->
    <div v-if="showViewAll" class="view-all-wrapper">
      <button class="view-all-btn">View All Products</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Grid, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'

// ─── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
  /**
   * 'row'   → single row slider (Image 2 / Today's)
   * 'grid'  → 2-row grid slider (Image 1 / Our Products)
   */
  layout: {
    type: String,
    default: 'row',   // 'row' | 'grid'
    validator: v => ['row', 'grid'].includes(v),
  },
  title: { type: String, default: "Today's" },
  showTimer: { type: Boolean, default: false },
  showViewAll: { type: Boolean, default: false },
  products: {
    type: Array,
    default: () => defaultProducts,
  },
})

// ─── Swiper modules ───────────────────────────────────────────────────────────
const modules = [Navigation, Grid, Autoplay]

// ─── Swiper instance ──────────────────────────────────────────────────────────
const swiperInstance = ref(null)
const onSwiper = (swiper) => { swiperInstance.value = swiper }
const slidePrev = () => swiperInstance.value?.slidePrev()
const slideNext = () => swiperInstance.value?.slideNext()

// ─── Hover state ─────────────────────────────────────────────────────────────
const hoveredCard = ref(null)

// ─── Responsive breakpoints ───────────────────────────────────────────────────
// Grid layout  → 2 rows, so slidesPerView is halved visually
// Row layout   → single row
const swiperBreakpoints = computed(() => {
  if (props.layout === 'grid') {
    return {
      0:    { slidesPerView: 1, spaceBetween: 12 },
      480:  { slidesPerView: 2, spaceBetween: 14 },
      768:  { slidesPerView: 2, spaceBetween: 16 },
      1024: { slidesPerView: 3, spaceBetween: 20 },
      1280: { slidesPerView: 4, spaceBetween: 24 },
    }
  }
  // Row (single row)
  return {
    0:    { slidesPerView: 1.2, spaceBetween: 12 },
    480:  { slidesPerView: 2,   spaceBetween: 14 },
    768:  { slidesPerView: 3,   spaceBetween: 16 },
    1024: { slidesPerView: 4,   spaceBetween: 20 },
    1280: { slidesPerView: 5,   spaceBetween: 24 },
  }
})

// ─── Countdown timer ─────────────────────────────────────────────────────────
const timer = ref({ hours: '00', minutes: '00', seconds: '00' })
let timerInterval = null

function pad (n) { return String(n).padStart(2, '0') }

function startTimer (totalSeconds = 86399) {
  let remaining = totalSeconds
  const tick = () => {
    if (remaining <= 0) { clearInterval(timerInterval); return }
    const h = Math.floor(remaining / 3600)
    const m = Math.floor((remaining % 3600) / 60)
    const s = remaining % 60
    timer.value = { hours: pad(h), minutes: pad(m), seconds: pad(s) }
    remaining--
  }
  tick()
  timerInterval = setInterval(tick, 1000)
}

onMounted(() => { if (props.showTimer) startTimer(57600) })
onUnmounted(() => clearInterval(timerInterval))

// ─── Default demo products ────────────────────────────────────────────────────
const defaultProducts = [
  {
    name: 'Gaming Controller',
    image: 'https://placehold.co/260x220/f5f5f5/333?text=Controller',
    price: 120, originalPrice: 200, rating: 4, reviews: 88,
    badge: '-40%', colors: [],
  },
  {
    name: 'RGB Keyboard',
    image: 'https://placehold.co/260x220/f5f5f5/333?text=Keyboard',
    price: 960, originalPrice: 1477, rating: 4, reviews: 75,
    badge: '-35%', colors: [],
  },
  {
    name: 'Curved Monitor',
    image: 'https://placehold.co/260x220/f5f5f5/333?text=Monitor',
    price: 370, originalPrice: 529, rating: 4, reviews: 99,
    badge: '-30%', colors: [],
  },
  {
    name: 'Dining Chair',
    image: 'https://placehold.co/260x220/f5f5f5/333?text=Chair',
    price: 375, originalPrice: 500, rating: 4.5, reviews: 62,
    badge: '-25%', colors: [],
  },
  {
    name: 'Canon Camera',
    image: 'https://placehold.co/260x220/f5f5f5/333?text=Camera',
    price: 360, rating: 4.5, reviews: 41,
    badge: null, colors: [],
  },
]
</script>

<style scoped>
/* ── Design tokens ── */
:root {
  --c-accent:   #DB4444;
  --c-bg:       #fff;
  --c-surface:  #F5F5F5;
  --c-text:     #1A1A1A;
  --c-muted:    #7a7a7a;
  --c-border:   #e8e8e8;
  --c-star:     #FFAD33;
  --radius:     8px;
  --transition: 0.28s cubic-bezier(.4,0,.2,1);
}

/* ── Section wrapper ── */
.product-section {
  padding: 40px 0;
  background: var(--c-bg);
  font-family: 'Poppins', 'Segoe UI', sans-serif;
}

/* ── Header ── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
  padding: 0 4px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.title-accent {
  display: inline-block;
  width: 14px;
  height: 36px;
  background: var(--c-accent);
  border-radius: 3px;
  flex-shrink: 0;
}
.section-title h2 {
  margin: 0;
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 700;
  color: var(--c-text);
  letter-spacing: -0.02em;
}

/* ── Countdown ── */
.countdown {
  display: flex;
  align-items: center;
  gap: 6px;
}
.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 42px;
}
.digits {
  font-size: 20px;
  font-weight: 700;
  color: var(--c-text);
  line-height: 1;
}
.label {
  font-size: 10px;
  color: var(--c-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
}
.sep {
  font-size: 22px;
  font-weight: 700;
  color: var(--c-accent);
  line-height: 1;
  margin-bottom: 12px;
}

/* ── Nav buttons ── */
.slider-nav {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid var(--c-border);
  background: var(--c-bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text);
  transition: background var(--transition), color var(--transition), border-color var(--transition);
}
.nav-btn:hover {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: #fff;
}

/* ── Swiper overrides ── */
.product-swiper {
  overflow: visible;
  padding-bottom: 8px;
}

/* Grid layout: 2 rows */
.layout-grid :deep(.swiper-wrapper) {
  flex-wrap: wrap; /* handled by Swiper Grid module */
}

/* ── Product Card ── */
.product-card {
  position: relative;
  background: var(--c-surface);
  border-radius: var(--radius);
  overflow: hidden;
  transition: box-shadow var(--transition), transform var(--transition);
  cursor: pointer;
  user-select: none;
}
.product-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,.10);
  transform: translateY(-2px);
}

/* ── Badge ── */
.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.03em;
}
.badge-new  { background: #00CC66; color: #fff; }
.badge-sale { background: var(--c-accent); color: #fff; }

/* ── Card image ── */
.card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--c-surface);
}
.card-image img {
  width: 80%;
  height: 80%;
  object-fit: contain;
  transition: transform var(--transition);
}
.product-card:hover .card-image img {
  transform: scale(1.05);
}

/* ── Hover overlay ── */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.04);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0;
  opacity: 0;
  transition: opacity var(--transition);
  pointer-events: none;
}
.card-overlay.visible {
  opacity: 1;
  pointer-events: all;
}
.overlay-btn.add-to-cart {
  width: 100%;
  padding: 12px;
  background: var(--c-text);
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background var(--transition);
}
.overlay-btn.add-to-cart:hover {
  background: var(--c-accent);
}

/* ── Quick action icons ── */
.quick-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 4;
}
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.10);
  color: var(--c-text);
  transition: background var(--transition), color var(--transition);
}
.action-btn:hover {
  background: var(--c-accent);
  color: #fff;
}

/* ── Card info ── */
.card-info {
  padding: 12px 14px 16px;
}
.price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}
.price {
  font-size: 18px;
  font-weight: 700;
  color: var(--c-accent);
}
.original-price {
  font-size: 13px;
  color: var(--c-muted);
  text-decoration: line-through;
}

/* ── Stars ── */
.rating {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 8px;
}
.star {
  font-size: 16px;
  color: #ddd;
  line-height: 1;
}
.star.filled { color: var(--c-star); }
.star.half   { color: var(--c-star); }   /* simple — extend with clip for precision */
.review-count {
  font-size: 12px;
  color: var(--c-muted);
  margin-left: 4px;
}

/* ── Color swatches ── */
.color-swatches {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}
.swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(0,0,0,.08);
  display: inline-block;
  cursor: pointer;
}
.swatch:hover { transform: scale(1.2); }

/* ── View All ── */
.view-all-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.view-all-btn {
  padding: 14px 48px;
  background: var(--c-accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.02em;
  /* transition: background var(--transition), transform var(--transition); */
}
.view-all-btn:hover {
  background: #c03333;
  transform: translateY(-1px);
}

/* ── Responsive tweaks ── */
@media (max-width: 480px) {
  .countdown { display: none; }
  .section-header { flex-direction: column; align-items: flex-start; }
  .slider-nav { margin-left: 0; }
}
</style>