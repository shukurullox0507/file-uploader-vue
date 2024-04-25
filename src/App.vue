<script setup lang="ts">
import SingleFile from "@/components/SingleFileUpload/SingleFile.vue";
import MultipleFile from "@/components/MultipleFileUpload/MultipleFile.vue";
</script>

<template>
  <SingleFile max-size-file="4000000"/>
  <hr>
  <MultipleFile max-size="200000"/>
</template>

<style scoped>

</style>
