<template>
  <div>
    <h2>Multiple File Upload</h2>
    <input type="file" multiple @change="handleFileUpload">
    <button @click="uploadFiles">Upload Files</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadFile } from '../services/api.ts';

const selectedFiles = ref<File[]>([]);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    selectedFiles.value = Array.from(input.files);
  }
};

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    console.error('No files selected');
    return;
  }

  const formData = new FormData();
  selectedFiles.value.forEach(file => {
    formData.append('files[]', file);
  });

  try {
    const response = await uploadFile(formData);
    console.log('Files uploaded:', response);
    // Optionally, emit an event to notify parent component of successful upload
  } catch (error:any) {
    console.error(error.message);
  }
};
</script>
