<script setup lang="ts">
import { BreakPoints, defaultFormValue, type FormType, type Responsive } from "@/types/types";
import { reactive, ref, computed } from "vue";
import GridsWrapper from "./GridsWrapper.vue";

const baseForm = reactive<FormType>(defaultFormValue);
const selectedResponsive = ref<BreakPoints>(BreakPoints.sm);

const updateGrid = (e) => {
  console.log("Grid updated:", baseForm, e.target);
};

const selectedColumn = computed(() => baseForm.responsive[selectedResponsive.value as keyof Responsive]);
</script>

<template>
  <div class="container px-10 mx-auto">
    <h3 class="text-center my-5 text-2xl">Tailwind Grid Generator</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Form Section -->
      <div>
        <form class="grid grid-cols-1 md:grid-cols-3 gap-2" @input="updateGrid">
          <div class="col-span-1 md:col-span-1">
            <label for="columnGrid" class="block mb-2 text-sm font-medium">Columns</label>
            <input type="number" id="columnGrid" v-model="selectedColumn" class="border rounded p-2 bg-stone-200" />
          </div>
          <div>
            <label for="rowGrid" class="block mb-2 text-sm font-medium">Items</label>
            <input type="number" id="rowGrid" v-model="baseForm.rows" class="border rounded p-2 bg-stone-200" />
          </div>
          <div>
            <label for="gap" class="block mb-2 text-sm font-medium">Gap</label>
            <input type="number" id="gap" v-model="baseForm.gap" class="border rounded p-2 bg-stone-200" />
          </div>
        </form>
      </div>

      <!-- Grid Preview -->
      <div class="pb-20">
        <GridsWrapper :baseForm="baseForm" />
      </div>
    </div>
  </div>
</template>
