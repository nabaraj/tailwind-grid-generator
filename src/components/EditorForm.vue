<script lang="ts">
import { reactive, ref } from "vue";

const defaultFormValue = {
  rows: 3,
  columns: 3,
  gap: 10,
};

export default {
  name: "GridGenerator",
  setup() {
    // Reactive form state
    const form = reactive(defaultFormValue);
    // document.body.classList.add("bg-slate-100");
    // Reactive grid object with rowSpan and colSpan for each item
    const grid = reactive({
      rows: form.rows,
      columns: form.columns,
      gap: form.gap,
      rowSpan: Array.from({ length: form.rows }, () => 1), // Default rowSpan = 1
      colSpan: Array.from({ length: form.rows }, () => 1), // Default colSpan = 1
    });

    const open = ref<number | null>(null); // Tracks the currently selected item for editing
    const copySuccess = ref(false); // Tracks if copy was successful
    // Update grid when form values change
    const updateGrid = () => {
      grid.rows = form.rows;
      grid.columns = form.columns;
      grid.gap = form.gap;

      // Adjust rowSpan and colSpan arrays when the number of rows changes
      grid.rowSpan = Array.from(
        { length: form.rows },
        (_, i) => grid.rowSpan[i] || 1
      );
      grid.colSpan = Array.from(
        { length: form.rows },
        (_, i) => grid.colSpan[i] || 1
      );
    };

    // Generate HTML preview dynamically
    const generateHTML = () => {
      const rows = Array.from({ length: form.rows }, (_, i) => {
        return `  <div class="${
          grid.rowSpan[i] > 1 ? "row-span-" + grid.rowSpan[i] : ""
        } ${grid.colSpan[i] > 1 ? "col-span-" + grid.colSpan[i] : ""}">Row ${
          i + 1
        }</div>`;
      }).join("\n");
      return `<div class="grid grid-cols-${form.columns} gap-${form.gap}">\n${rows}\n</div>`;
    };

    const showRowSpan = (index: number) => {
      open.value = open.value === index ? null : index; // Toggle open item
    };

    // Copy generated HTML to clipboard
    const copyToClipboard = async () => {
      try {
        const html = generateHTML();
        await navigator.clipboard.writeText(html);
        copySuccess.value = true;

        // Reset success message after 2 seconds
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
              class="border rounded p-2"
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
              class="border rounded p-2"
            />
          </div>
          <div>
            <label for="gap" class="block mb-2 text-sm font-medium">Gap</label>
            <input
              type="number"
              id="gap"
              v-model="form.gap"
              class="border rounded p-2"
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
                class="border rounded p-2 w-full"
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
                class="border rounded p-2 w-full"
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
            :class="`border rounded-sm p-4 row-span-${
              grid.rowSpan[index]
            } col-span-${grid.colSpan[index]} ${
              index === open ? 'shadow-md shadow-slate-400' : ''
            }`"
            @click="showRowSpan(index)"
          >
            Row {{ index + 1 }}
          </div>
        </div>
        <h3 class="text-xl my-4">HTML Code to copy</h3>
        <div
          class="bg-slate-50 p-4 border text-sm border-slate-300 relative rounded-sm"
        >
          <pre>{{ generateHTML() }}</pre>
          <button
            @click="copyToClipboard"
            :disabled="copySuccess"
            class="text-gray-900 rounded-bl-lg bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium text-xs px-3 py-2 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 absolute top-0 right-0"
          >
            <templage v-if="copySuccess">Copied to clipboard!</templage>
            <templalte v-else> Copy HTML</templalte>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional styling */
</style>
