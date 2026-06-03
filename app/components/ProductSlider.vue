<script setup lang="ts">
import { ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GridOptions {
  rows: number;
  fill?: "row" | "column";
}

interface BreakpointConfig {
  slidesPerView?: number;
  spaceBetween?: number;
  /** Override grid rows at this breakpoint (grid layout only) */
  grid?: GridOptions;
}

interface SliderProps {
  items: any[];
  /** 'row' = single-row slider | 'grid' = 2-row grid slider */
  layout?: "row" | "grid";
  /** Number of grid rows (grid layout only, default 2) */
  gridRows?: number;
  slidesPerView?: number;
  spaceBetween?: number;
  /**
   * Custom breakpoints. Each key is a min-width in px.
   * You only need to set slidesPerView / spaceBetween — grid config is
   * derived automatically from `layout` + `gridRows` unless you override it.
   */
  breakpoints?: Record<number, BreakpointConfig>;
  loop?: boolean;
  autoplay?: boolean | { delay?: number; disableOnInteraction?: boolean };
  navigation?: boolean;
  pagination?: boolean;
}

// ─── Props ────────────────────────────────────────────────────────────────────

const props = withDefaults(defineProps<SliderProps>(), {
  layout: "row",
  gridRows: 2,
  slidesPerView: 4,
  spaceBetween: 24,
  loop: false,
  autoplay: false,
  navigation: true,
  pagination: false,
  // Default responsive breakpoints — sensible for both row & grid
  breakpoints: () => ({
    0:    { slidesPerView: 1,   spaceBetween: 12 },
    480:  { slidesPerView: 2,   spaceBetween: 14 },
    768:  { slidesPerView: 2,   spaceBetween: 16 },
    1024: { slidesPerView: 3,   spaceBetween: 20 },
    1280: { slidesPerView: 4,   spaceBetween: 24 },
  }),
});

// ─── Swiper modules ───────────────────────────────────────────────────────────
// Grid MUST be included whenever layout === 'grid'; harmless otherwise.
const modules = [Navigation, Pagination, Autoplay, Grid];

// ─── Swiper instance (custom nav) ────────────────────────────────────────────
const swiperRef = ref<SwiperType | null>(null);
const onSwiper = (swiper: SwiperType) => { swiperRef.value = swiper; };
const slidePrev = () => swiperRef.value?.slidePrev();
const slideNext = () => swiperRef.value?.slideNext();

// ─── Grid config ─────────────────────────────────────────────────────────────
// When layout === 'grid', inject `grid` into every breakpoint that doesn't
// already define one, and double slidesPerView so the grid fills correctly.
const resolvedBreakpoints = computed<Record<number, BreakpointConfig>>(() => {
  if (props.layout !== "grid") return props.breakpoints;

  const result: Record<number, BreakpointConfig> = {};
  for (const [bp, cfg] of Object.entries(props.breakpoints)) {
    result[Number(bp)] = {
      ...cfg,
      // Swiper Grid needs the grid option repeated per breakpoint
      grid: cfg.grid ?? { rows: props.gridRows, fill: "row" },
    };
  }
  return result;
});

// ─── Top-level grid option (applies before first breakpoint) ─────────────────
const gridOption = computed<GridOptions | undefined>(() =>
  props.layout === "grid" ? { rows: props.gridRows, fill: "row" } : undefined
);

// ─── Autoplay config ─────────────────────────────────────────────────────────
const autoplayConfig = computed(() => {
  if (!props.autoplay) return false;
  if (typeof props.autoplay === "object") return props.autoplay;
  return { delay: 3000, disableOnInteraction: false };
});
</script>

<template>
  <div class="base-slider" :class="`base-slider--${layout}`">
    <!-- Custom navigation buttons (always rendered; hidden via CSS if navigation=false) -->
    <button
      v-if="navigation"
      class="slider-nav-btn slider-nav-btn--prev"
      aria-label="Previous slide"
      @click="slidePrev"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <button
      v-if="navigation"
      class="slider-nav-btn slider-nav-btn--next"
      aria-label="Next slide"
      @click="slideNext"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    <Swiper
      class="base-slider__swiper"
      :modules="modules"
      :slides-per-view="slidesPerView"
      :space-between="spaceBetween"
      :breakpoints="resolvedBreakpoints"
      :grid="gridOption"
      :loop="loop"
      :autoplay="autoplayConfig"
      :pagination="pagination ? { clickable: true } : false"
      @swiper="onSwiper"
    >
      <SwiperSlide v-for="item in items" :key="item.id ?? item">
        <!--
          Default slot: renders nothing — consumer must use the named slot.
          Named slot:   <template #item="{ item }"> ... </template>
        -->
        <slot name="item" :item="item" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
/* ─── Design tokens (override in parent or :root as needed) ── */
.base-slider {
  --slider-nav-size: 40px;
  --slider-nav-bg: #ffffff;
  --slider-nav-border: #e0e0e0;
  --slider-nav-color: #1a1a1a;
  --slider-nav-hover-bg: #DB4444;
  --slider-nav-hover-color: #ffffff;
  --slider-nav-hover-border: #DB4444;
  --slider-transition: 0.26s cubic-bezier(0.4, 0, 0.2, 1);
  --slider-radius: 50%;

  position: relative;
}

/* ─── Swiper core ── */
.base-slider__swiper {
  width: 100%;
  /* clip hidden for row, allow overflow for peek effect */
  overflow: hidden;
}

/* Grid layout: Swiper's Grid module sets height — let it breathe */
.base-slider--grid .base-slider__swiper {
  overflow: hidden;  /* required by Swiper Grid */
}

/* ─── Custom nav buttons ── */
.slider-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: var(--slider-nav-size);
  height: var(--slider-nav-size);
  border-radius: var(--slider-radius);
  border: 1.5px solid var(--slider-nav-border);
  background: var(--slider-nav-bg);
  color: var(--slider-nav-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    background var(--slider-transition),
    color var(--slider-transition),
    border-color var(--slider-transition),
    box-shadow var(--slider-transition);
}

.slider-nav-btn:hover {
  background: var(--slider-nav-hover-bg);
  color: var(--slider-nav-hover-color);
  border-color: var(--slider-nav-hover-border);
  box-shadow: 0 4px 16px rgba(219, 68, 68, 0.25);
}

.slider-nav-btn--prev { left: -20px; }
.slider-nav-btn--next { right: -20px; }

/* Inline mode: nav sits inside the slider area */
.base-slider--row .slider-nav-btn--prev { left: 0; }
.base-slider--row .slider-nav-btn--next { right: 0; }

/* ─── Pagination dots (if enabled) ── */
.base-slider :deep(.swiper-pagination-bullet) {
  background: #1a1a1a;
  opacity: 0.25;
}
.base-slider :deep(.swiper-pagination-bullet-active) {
  background: #DB4444;
  opacity: 1;
}

/* ─── Responsive: stack nav below swiper on mobile ── */
@media (max-width: 479px) {
  .slider-nav-btn--prev,
  .slider-nav-btn--next {
    top: auto;
    bottom: -52px;
    transform: none;
  }
  .slider-nav-btn--prev { left: calc(50% - 48px); }
  .slider-nav-btn--next { left: calc(50% + 8px); }

  .base-slider {
    padding-bottom: 60px; /* room for stacked nav */
  }
}
</style>