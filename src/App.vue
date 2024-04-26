<script setup lang="ts">
import SingleFile from "@/components/SingleFileUpload/SingleFile.vue";
import MultipleFile from "@/components/MultipleFileUpload/MultipleFile.vue";
</script>

<template>
  <SingleFile max-size-file="4000000" file-type="application/pdf"/>
  <hr>
  <MultipleFile max-size="200000" max-count="5" is-multiple="is-multiple"/>
</template>

<style scoped>

</style>
