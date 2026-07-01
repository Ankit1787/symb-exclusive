<script setup lang="ts">
interface Tab {
  key: string;
  label: string;
}

const props = defineProps<{
  tabs: Tab[];
  modelValue: string;
  showTabs: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [string];
}>();
</script>

<template>
  <div v-if="showTabs" class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="tab-btn"
      :class="{ active: modelValue === tab.key }"
      @click="emit('update:modelValue', tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>

  <div class="tab-content">
    <slot :currentTab="modelValue"/>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: #DB4444;
  border-bottom-color: #DB4444;
  font-weight: 600;
}

.tab-content {
  margin-top: 24px;
}
</style>