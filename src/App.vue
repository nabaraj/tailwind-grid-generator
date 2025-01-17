<script setup lang="ts">
import EditorForm from "./components/EditorForm.vue";
</script>

<template>
  <main class="main fixed w-full h-full overflow-auto">
    <EditorForm />
  </main>
</template>

<style scoped>
.main{
  background: url('@/assets/grid.jpg') repeat 0 0;
  background-size: 50%;
}
</style>
