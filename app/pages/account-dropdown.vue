<template>
  <NuxtLayout>
    <div class="dropdown-page">
      <div class="dropdown-demo">
        <NuxtLink to="/myaccount">◉ Manage My Account</NuxtLink>
        <NuxtLink to="/cart">⌑ My Order</NuxtLink>
        <a>✕ My Cancellations</a>
        <a>☆ My Reviews</a>
        <NuxtLink to="/login">↩ Logout</NuxtLink>
      </div>
      <div class="container page-gap">
        <SectionHeader eyebrow="Account" title="Account Dropdown With Account" />
        <ProductGrid :count="8" />
      </div>
    </div>
  </NuxtLayout>
</template>
