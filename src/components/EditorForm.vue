<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import ShowHtmlCode from "./ShowHtmlCode.vue";
import ColumnEditor from "./ColumnEditor.vue";

enum BreakPoints {
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
  "2xl" = "2xl",
}
const selectedResponsive = ref(BreakPoints.sm);
const itemInRows: Record<string, number> = reactive({
  sm: 3,
  md: 3,
  lg: 3,
  xl: 3,
  "2xl": 3,
});
const form = reactive({
  items: 3,
  gap: 10,
});
const toggleHtml = ref(false);
const open = ref<number | null>(null);
const copySuccess = ref(false);
const columnDetails = reactive({
  rowSpan: Array.from({ length: form.items }, () => 1),
  colSpan: Array.from({ length: form.items }, () => 1),
});
// Copy generated HTML to clipboard

const columnGrid = computed(() => {
  const smValue = itemInRows.sm;
  const appLayoutObject: Record<string, number> = { sm: smValue, ...form };
  for (let breakPoint in itemInRows) {
    if (
      itemInRows[breakPoint] &&
      itemInRows[breakPoint] !== smValue &&
      itemInRows[breakPoint] > 0
    ) {
      appLayoutObject[breakPoint] = itemInRows[breakPoint];
    }
  }
  return appLayoutObject;
});
const getResponsiveClass = (ignoreBreakPoints = false) => {
  console.log(columnGrid.value);
  let className = `grid-cols-${itemInRows.sm}`;
  if (!ignoreBreakPoints) {
    for (const item in itemInRows) {
      if (columnGrid.value[item]) {
        if (item !== "sm") {
          className += ` ${item}:grid-cols-${columnGrid.value[item]}`;
        }
      }
    }
  }
  return className;
};
const createHtmlCode = computed(() => {
  const items = [];
  for (let i = 0; i < form.items; i++) {
    const rowSpan =
      columnDetails.rowSpan[i] > 1
        ? `row-span-${columnDetails.rowSpan[i]}`
        : "";
    const colSpan =
      columnDetails.colSpan[i] > 1
        ? `col-span-${columnDetails.colSpan[i]}`
        : "";
    const className = `${rowSpan} ${colSpan}`.trim();

    items.push(
      ` <div${className ? " class=" + className : ""}>Grid Item ${i + 1}</div>`
    );
  }
  return `<div class="grid ${getResponsiveClass()} gap-${
    form.gap
  }">\n${items.join("\n")}\n</div>`;
});

const copyToClipboard = async () => {
  try {
    const html = createHtmlCode.value;
    await navigator.clipboard.writeText(html);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
  }
};

const setSelectedItem = (index: number) => {
  open.value = index;
};
watch(
  () => form.items,
  (newVal, oldVal) => {
    const diff = newVal - oldVal;
    open.value = null;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        columnDetails.rowSpan.push(1);
        columnDetails.colSpan.push(1);
      }
    } else if (diff < 0) {
      columnDetails.rowSpan.splice(diff);
      columnDetails.colSpan.splice(diff);
    }
  }
);
</script>

<template>
  <div class="container px-10 mx-auto">
    <h3 class="text-center my-5 text-2xl">Tailwind Grid Generator</h3>
    <button
      @click="() => (toggleHtml = !toggleHtml)"
      class="z-20 md:hidden fixed right-0 border-l border-t border-b border-slate-300 p-2 rounded-lt-3 rounded-l-md top-10"
    >
      <span class="sr-only">Open main menu</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-code-slash"
        viewBox="0 0 16 16"
      >
        <path
          d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"
        />
      </svg>
    </button>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Form Section -->
      <div>
        <form class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div class="col-span-1 md:col-span-3">
            <label for="responsive" class="block">Responsive Width</label>
            <select
              name="responsive"
              id="responsive"
              class="border rounded p-2 bg-stone-200"
              v-model="selectedResponsive"
            >
              <option
                v-for="bp in Object.values(BreakPoints)"
                :key="bp"
                :value="bp"
              >
                {{ bp }}
              </option>
            </select>
          </div>
          <div class="col-span-1 md:col-span-1">
            <label for="columnGrid" class="block mb-2 text-sm font-medium"
              >Columns</label
            >
            <input
              type="number"
              id="columnGrid"
              v-model="itemInRows[selectedResponsive]"
              class="border rounded p-2 bg-stone-200"
            />
          </div>
          <div>
            <label for="rowGrid" class="block mb-2 text-sm font-medium"
              >Number of Items</label
            >
            <input
              type="number"
              id="rowGrid"
              v-model="form.items"
              class="border rounded p-2 bg-stone-200"
            />
          </div>
          <div>
            <label for="gap" class="block mb-2 text-sm font-medium">Gap</label>
            <input
              type="number"
              id="gap"
              v-model="form.gap"
              class="border rounded p-2 bg-stone-200"
            />
          </div>

          <!-- RowSpan and ColSpan Editing -->
          <ColumnEditor
            :open="open"
            :columnDetails="columnDetails"
            @close="open = null"
          />
        </form>
      </div>

      <!-- Grid Preview -->
      <div class="pb-20">
        <div :class="`grid ${getResponsiveClass(true)} gap-${form.gap}`">
          <div
            class="border rounded-sm p-4 bg-stone-200"
            :class="`${
              columnDetails.rowSpan[index] > 1
                ? 'row-span-' + columnDetails.rowSpan[index]
                : ''
            } ${
              columnDetails.colSpan[index] > 1
                ? 'col-span-' + columnDetails.colSpan[index]
                : ''
            }
            ${open === index ? 'shadow-md shadow-slate-400' : ''}    
            `"
            v-for="(row, index) in form.items"
            :key="index"
            @click="setSelectedItem(index)"
          >
            Grid Item {{ index + 1 }}
            <span class="text-xs block italic text-slate-500"
              >Click on the grid items to add row and col span</span
            >
          </div>
        </div>
        <ShowHtmlCode
          :toggleHtml="toggleHtml"
          :createHtmlCode="createHtmlCode"
        />
      </div>
    </div>
  </div>
</template>
