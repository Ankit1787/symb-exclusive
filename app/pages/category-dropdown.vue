<template>
  <NuxtLayout>
    <div class="dropdown-page">
      <div class="category-menu-demo">
        <NuxtLink to="/">Woman’s Clothing</NuxtLink>
        <NuxtLink to="/">Men’s Clothing</NuxtLink>
        <NuxtLink to="/">Shoes</NuxtLink>
        <NuxtLink to="/">Watches</NuxtLink>
      </div>
      <NuxtPage />
      <div class="container page-gap">
        <SectionHeader eyebrow="Categories" title="Category Dropdown" />
        <ProductGrid :count="8" />
      </div>
    </div>
  </NuxtLayout>
</template>
