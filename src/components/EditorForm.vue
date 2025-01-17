<script lang="ts">
import { reactive, ref } from "vue";

// Define types for form and grid
interface FormType {
  rows: number;
  columns: number;
  gap: number;
}

interface GridType {
  rows: number;
  columns: number;
  gap: number;
  rowSpan: number[];
  colSpan: number[];
}

const defaultFormValue: FormType = {
  rows: 3,
  columns: 3,
  gap: 10,
};

export default {
  name: "GridGenerator",
  setup() {
    // Reactive form state
    const form = reactive<FormType>({ ...defaultFormValue });

    // Reactive grid state
    const grid = reactive<GridType>({
      rows: form.rows,
      columns: form.columns,
      gap: form.gap,
      rowSpan: Array.from({ length: form.rows }, () => 1),
      colSpan: Array.from({ length: form.rows }, () => 1),
    });

    const open = ref<number | null>(null);
    const copySuccess = ref(false);

    // Update grid state when form values change
    const updateGrid = () => {
      grid.rows = form.rows;
      grid.columns = form.columns;
      grid.gap = form.gap;

      // Dynamically adjust rowSpan and colSpan lengths
      while (grid.rowSpan.length < form.rows) grid.rowSpan.push(1);
      while (grid.colSpan.length < form.rows) grid.colSpan.push(1);
      grid.rowSpan.length = form.rows;
      grid.colSpan.length = form.rows;
    };

    // Generate HTML preview dynamically
    const generateHTML = (): string => {
      const rows = Array.from({ length: form.rows }, (_, i) => {
        const rowClass = [
          grid.rowSpan[i] > 1 ? `row-span-${grid.rowSpan[i]}` : "",
          grid.colSpan[i] > 1 ? `col-span-${grid.colSpan[i]}` : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `  <div class="${rowClass}">Grid Item ${i + 1}</div>`;
      }).join("\n");

      return `<div class="grid grid-cols-${form.columns} gap-${form.gap}">\n${rows}\n</div>`;
    };

    const showRowSpan = (index: number) => {
      open.value = open.value === index ? null : index;
    };

    // Copy generated HTML to clipboard
    const copyToClipboard = async () => {
      try {
        const html = generateHTML();
        await navigator.clipboard.writeText(html);
        copySuccess.value = true;
        setTimeout(() => {
          copySuccess.value = false;
        }, 2000);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    };

    return {
      form,
      grid,
      open,
      copySuccess,
      updateGrid,
      generateHTML,
      showRowSpan,
      copyToClipboard,
    };
  },
};
</script>

<template>
  <div class="container mx-auto">
    <h3 class="text-center my-5 text-2xl">Tailwind Grid Generator</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Form Section -->
      <div>
        <form class="grid grid-cols-1 md:grid-cols-3 gap-2" @input="updateGrid">
          <div>
            <label for="columnGrid" class="block mb-2 text-sm font-medium"
              >Columns</label
            >
            <input
              type="number"
              id="columnGrid"
              v-model="form.columns"
              class="border rounded p-2 bg-stone-200"
            />
          </div>
          <div>
            <label for="rowGrid" class="block mb-2 text-sm font-medium"
              >Rows</label
            >
            <input
              type="number"
              id="rowGrid"
              v-model="form.rows"
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
          <div
            v-if="open !== null"
            class="col-span-2 grid grid-cols-2 gap-2 py-4 relative"
          >
            <span class="absolute right-0 cursor-pointer" @click="open = null"
              >X</span
            >
            <div>
              <label for="rowspan" class="block mb-2 text-sm font-medium"
                >Row Span</label
              >
              <input
                type="number"
                id="rowspan"
                v-model="grid.rowSpan[open]"
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
                v-model="grid.colSpan[open]"
                class="border rounded p-2 w-full bg-stone-200"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Grid Preview -->
      <div>
        <div :class="`grid grid-cols-${form.columns} gap-${form.gap}`">
          <div
            v-for="(row, index) in form.rows"
            :key="index"
            :class="
              [
                'border rounded-sm p-4 bg-stone-200 ',
                open === index ? 'shadow-md shadow-slate-400' : '',
                grid.rowSpan[index] > 1
                  ? `row-span-${grid.rowSpan[index]}`
                  : '',
                grid.colSpan[index] > 1
                  ? `col-span-${grid.colSpan[index]}`
                  : '',
              ]
                .filter(Boolean)
                .join(' ')
            "
            @click="showRowSpan(index)"
          >
            Grid Item {{ index + 1 }}
          </div>
        </div>
        <h3 class="text-xl my-4">HTML Code to Copy</h3>
        <div
          class="bg-stone-200 p-4 border text-sm border-slate-300 relative rounded-sm"
        >
          <pre>{{ generateHTML() }}</pre>
          <button
            @click="copyToClipboard"
            :disabled="copySuccess"
            class="absolute top-0 right-0 p-2 bg-gray-200 hover:bg-gray-300 rounded-bl-md hover:shadow-sm"
          >
            {{ copySuccess ? "Copied!" : "Copy HTML" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
