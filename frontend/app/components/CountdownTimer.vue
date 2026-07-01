<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    endDate: string | Date;
    compact?: boolean;
  }>(),
  {
    compact: false,
  },
);

const now = ref(Date.now());
let intervalId: ReturnType<typeof setInterval> | null = null;

const endTime = computed(() => new Date(props.endDate).getTime());
const remaining = computed(() => Math.max(0, endTime.value - now.value));

const parts = computed(() => {
  const totalSeconds = Math.floor(remaining.value / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];
});

const formatValue = (value: number) => String(value).padStart(2, "0");

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="countdown-timer" :class="{ 'countdown-timer--compact': compact }">
    <div v-for="part in parts" :key="part.label" class="countdown-item">
      <strong>{{ formatValue(part.value) }}</strong>
      <span>{{ part.label }}</span>
    </div>
  </div>
</template>
