<script lang="ts">
import { reactive, ref } from "vue";

enum BreakPoints {
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
  "2xl" = "2xl"
}

// Define the Responsive type where "sm" is required and others are optional
type Responsive = { sm: number } & { [key in Exclude<`${BreakPoints}`, "sm">]?: number };

// Define types for form and grid
interface FormType {
  rows: number;
  columns: number;
  gap: number;
  responsive: Responsive;
}

interface GridType {
  rows: number;
  columns: number;
  gap: number;
  rowSpan: number[];
  colSpan: number[];
}

const columnDefault = 3;

const defaultFormValue: FormType = {
  rows: 3,
  columns: columnDefault,
  gap: 10,
  responsive: { sm: 3 } // ✅ Corrected: BreakPoints.sm is "sm", which is a string
};

export default {
  name: "GridGenerator",
  setup() {
    // Reactive form state
    const form = reactive<FormType>({ ...defaultFormValue });
    const selectedResponsive = ref<BreakPoints>(BreakPoints.sm);
    const toggleHtml = ref<boolean>(false)

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
    const getResponsiveClass = () => {
      const mobileViewValue = form.responsive[BreakPoints.sm];
      let classes = Object.keys(form.responsive).reduce((classNames, breakPoint) => {
        if (breakPoint === BreakPoints.sm) {
          classNames = classNames + `grid-cols-${mobileViewValue}`
        }
        if (breakPoint !== BreakPoints.sm && form.responsive[breakPoint as keyof Responsive] !== mobileViewValue) {
          classNames = classNames + ` ${breakPoint}:grid-cols-${form.responsive[breakPoint as keyof Responsive]}`
        }
        console.log({ classNames })
        return classNames;
      }, '')
      return classes
    }
    // Update grid state when form values change
    const updateGrid = (event: Event) => {
      console.log('updateGrid', event);

      const target = event.target as HTMLInputElement;
      if (!target) return;

      const targetName = target.name;

      if (targetName === 'responsive') {
        const responsiveValue = target.value as keyof Responsive; // ✅ Ensure valid index
        selectedResponsive.value = responsiveValue as BreakPoints;

        console.log(form.responsive);

        if (!form.responsive[responsiveValue]) {
          form.responsive[responsiveValue] = defaultFormValue.columns;
        }
      }

      grid.rows = form.rows;
      grid.columns = form.columns;
      grid.gap = form.gap;

      // Dynamically adjust rowSpan and colSpan lengths
      while (grid.rowSpan.length < form.rows) grid.rowSpan.push(1);
      while (grid.colSpan.length < form.columns) grid.colSpan.push(1);

      grid.rowSpan.length = form.rows;
      grid.colSpan.length = form.columns; // Updated from form.rows
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

      return `<div class="grid ${getResponsiveClass()} gap-${form.gap}">\n${rows}\n</div>`;
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
      selectedResponsive,
      BreakPoints,
      getResponsiveClass,
      toggleHtml
    };
  },
};
</script>

<template>
  <div class="container px-10 mx-auto">
    <h3 class="text-center my-5 text-2xl">Tailwind Grid Generator</h3>
    <button @click="() => toggleHtml = !toggleHtml"
      class="z-20 md:hidden fixed right-0 border-l border-t border-b border-slate-300 p-2 rounded-lt-3 rounded-l-md top-10"><span
        class="sr-only">Open main
        menu</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash"
        viewBox="0 0 16 16">
        <path
          d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
      </svg>
    </button>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Form Section -->
      <div>
        <form class="grid grid-cols-1 md:grid-cols-3 gap-2" @input="updateGrid">
          <div class="col-span-1 md:col-span-3">
            <label for="responsive" class="block">Responsive Width</label>
            <select name="responsive" id="responsive" class="border rounded p-2 bg-stone-200"
              v-model="selectedResponsive">
              <option v-for="bp in Object.values(BreakPoints)" :key="bp" :value="bp">
                {{ bp }}
              </option>
            </select>
          </div>
          <div class="col-span-1 md:col-span-1">
            <label for="columnGrid" class="block mb-2 text-sm font-medium">Columns</label>
            <input type="number" id="columnGrid" v-model="form.responsive[selectedResponsive as keyof Responsive]"
              class="border rounded p-2 bg-stone-200" />
          </div>
          <div>
            <label for="rowGrid" class="block mb-2 text-sm font-medium">Items</label>
            <input type="number" id="rowGrid" v-model="form.rows" class="border rounded p-2 bg-stone-200" />
          </div>
          <div>
            <label for="gap" class="block mb-2 text-sm font-medium">Gap</label>
            <input type="number" id="gap" v-model="form.gap" class="border rounded p-2 bg-stone-200" />
          </div>

          <!-- RowSpan and ColSpan Editing -->
          <div v-if="open !== null" class="col-span-1 md:col-span-2 w-full grid grid-cols-2 gap-2 py-4 relative">
            <span class="absolute right-0 cursor-pointer" @click="open = null">X</span>
            <div>
              <label for="rowspan" class="block mb-2 text-sm font-medium">Row Span</label>
              <input type="number" id="rowspan" v-model="grid.rowSpan[open]"
                class="border rounded p-2 w-full bg-stone-200" />
            </div>
            <div>
              <label for="colspan" class="block mb-2 text-sm font-medium">Col Span</label>
              <input type="number" id="colspan" v-model="grid.colSpan[open]"
                class="border rounded p-2 w-full bg-stone-200" />
            </div>
          </div>
        </form>
      </div>

      <!-- Grid Preview -->
      <div class="pb-20">
        <div :class="`grid ${getResponsiveClass()} gap-${form.gap}`">
          <div v-for="(row, index) in form.rows" :key="index" :class="[
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
            " @click="showRowSpan(index)">
            Grid Item {{ index + 1 }}
            <span class="text-xs block italic text-slate-500">Click on the grid items to add row and col span</span>
          </div>

        </div>
        <div
          :class="`fixed md:static top-0 w-full transition-all duration-300 ease-in-out 
    ${toggleHtml ? 'translate-x-0 left-0' : 'translate-x-full md:translate-x-0 left-[100%]'} bg-white md:bg-transparent p-5 md:p-0 h-full z-10`">
          <h3 class="text-xl my-4">HTML Code to Copy</h3>
          <div class="bg-stone-200 text-wrap break-words p-4 border relative text-sm border-slate-300 rounded-sm">
            <pre class="text-wrap break-words">{{ generateHTML() }}</pre>
            <button @click="copyToClipboard" :disabled="copySuccess"
              class="absolute top-0 right-0 p-2 bg-gray-200 hover:bg-gray-300 rounded-bl-md hover:shadow-sm">
              {{ copySuccess ? "Copied!" : "Copy HTML" }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
