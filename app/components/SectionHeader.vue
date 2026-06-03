<script setup lang="ts">
defineProps<{ eyebrow: string; title: string; action?: string;link?:string }>()
</script>

<template>
  <div class="section-head">
    <div>
      <div class="eyebrow">{{ eyebrow }}</div>
      <h2 class="section-title">{{ title }}</h2>
    </div>
    <NuxtLink v-if="action" class="btn" :to="link">{{ action }}</NuxtLink>
  </div>
</template>

