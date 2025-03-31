<template>
    <template v-if="baseForm">
        <div :class="`grid ${getResponsiveClass()} gap-${baseForm.gap}`">
            <div v-for="(item, index) in baseForm.rows" :key="index">Grid Item {{ index + 1 }}
                <span class="text-xs block italic text-slate-500">Click on the grid items to add row and col span</span>
            </div>
        </div>
    </template>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = defineProps<{ baseForm: any }>();

// Ensure reactivity of props and provide a fallback
const baseFormReactive = computed(() => props.baseForm || { rows: 0, gap: 0 });

const getResponsiveClass = () => {
    return "grid-cols-3"; // Modify logic as needed
};

// Use computed property for Tailwind class updates
const gridClass = computed(() => {
    return `grid ${getResponsiveClass()} gap-${baseFormReactive.value.gap}`;
});
</script>

<style lang="scss" scoped></style>