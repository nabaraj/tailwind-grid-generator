<template>
  <div
    v-if="open !== null"
    class="col-span-1 md:col-span-2 w-full grid grid-cols-2 gap-2 py-4 relative"
  >
    <span class="absolute right-0 cursor-pointer" @click="$emit('close')"
      >X</span
    >

    <div>
      <label for="rowspan" class="block mb-2 text-sm font-medium"
        >Row Span</label
      >
      <input
        type="number"
        id="rowspan"
        v-model="columnDetails.rowSpan[open]"
        class="border rounded p-2 w-full bg-stone-200"
      />
    </div>

    <div>
      <label for="colspan" class="block mb-2 text-sm font-medium"
        >Col Span</label
      >
      <input
        type="number"
        id="colspan"
        v-model="columnDetails.colSpan[open]"
        class="border rounded p-2 w-full bg-stone-200"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: number | null;
  columnDetails: {
    rowSpan: Record<number, number>;
    colSpan: Record<number, number>;
  };
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>
