<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import AIShoppingAssistant from './components/AIShoppingAssistant.vue';
</script>
<template>
  <div>
     <Toaster />
    <NuxtPage />
    <AIShoppingAssistant/>
  </div>
</template>

