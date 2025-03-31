<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const category = route.query.category;
</script>
<template>
  <h1>Products - {{ category }}</h1>
</template>
