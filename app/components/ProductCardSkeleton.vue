<template>
  <article class="product-card product-card-skeleton" aria-hidden="true">
    <div class="product-media skeleton-box skeleton-media"></div>
    <div class="skeleton-line skeleton-title"></div>
    <div class="skeleton-line skeleton-price"></div>
    <div class="skeleton-line skeleton-rating"></div>
  </article>
</template>

<style scoped>
.product-card-skeleton {
  pointer-events: none;
}

.skeleton-box,
.skeleton-line {
  position: relative;
  overflow: hidden;
  background: #f1f1f1;
}

.skeleton-box::after,
.skeleton-line::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.75),
    transparent
  );
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}

.skeleton-media {
  border-radius: 4px;
}

.skeleton-line {
  height: 16px;
  border-radius: 4px;
}

.skeleton-title {
  width: 82%;
  margin-top: 16px;
}

.skeleton-price {
  width: 48%;
  margin-top: 12px;
}

.skeleton-rating {
  width: 64%;
  margin-top: 14px;
}

@keyframes skeleton-shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>
