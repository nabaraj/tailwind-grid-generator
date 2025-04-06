<template>
  <div
    :class="`fixed md:static top-0 w-full transition-all duration-300 ease-in-out 
        ${
          toggleHtml
            ? 'translate-x-0 left-0'
            : 'translate-x-full md:translate-x-0 left-[100%]'
        } bg-white md:bg-transparent p-5 md:p-0 h-full z-10`"
  >
    <h3 class="text-xl my-4">HTML Code to Copy</h3>
    <div
      class="bg-stone-200 text-wrap break-words p-4 border relative text-sm border-slate-300 rounded-sm"
    >
      <pre class="text-wrap break-words">{{ createHtmlCode }}</pre>
      <button
        @click="copyToClipboard"
        :disabled="copySuccess"
        class="absolute top-0 right-0 p-2 bg-gray-200 hover:bg-gray-300 rounded-bl-md hover:shadow-sm"
      >
        {{ copySuccess ? "Copied!" : "Copy HTML" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
const props = defineProps<{
  toggleHtml: boolean;
  createHtmlCode: string;
}>();

const copySuccess = ref(false);

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.createHtmlCode);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
  }
};
</script>
