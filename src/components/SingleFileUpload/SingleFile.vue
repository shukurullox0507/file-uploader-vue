<template>
  <div class="single">
    <h2>Single File Upload</h2>
    <div class="upload-container">
      <label for="upload" class="upload-label-file">
        <div v-if="selectedFile">
          <img v-if="selectedFile?.type.includes('zip')" src="../../assets/folder_zip.png" alt="zip">
          <img v-else-if="selectedFile?.type.includes('html')" src="../assets/html.png" alt="html">
          <img v-else-if="selectedFile?.type.includes('pdf')" src="../../assets/pdf.png" alt="pdf">
          <img v-else-if="selectedFile?.type.includes('sql')" src="../../assets/sql.png" alt="sql">
          <img v-else src="../../assets/nomalum.png" alt="other">
        </div>
        <svg v-else fill="#000000" width="100px" height="100px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 3.793V9H7V3.864L5.914 4.95 4.5 3.536 8.036 0l.707.707.707.707 2.121 2.122-1.414 1.414L9 3.793zM16 11v5H0v-5h2v3h12v-3h2z" fill-rule="evenodd"/>
        </svg>
        <input id="upload" type="file" @change="handleFileUpload">
      </label>
      <p v-if="!selectedFile">Tap to choose file</p>
      <p v-else>{{ selectedFile?.name }}</p>
    </div>
    <button v-if="selectedFile" @click="handleUpload" >Upload File</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadFile } from '@/services/api';
import {useToast} from 'vue-toast-notification';

interface CustomFile {
  name: string,
  type: string,
  size: number,
  uploadedFile: File,
}


const selectedFile = ref<CustomFile | null>(null);
const MAX_FILE_SIZE = 20 * 1024 * 1024 // => 20mb
const toast = useToast()
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    selectedFile.value = {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedFile:file,
    };
  }
};

const handleUpload = async () => {
  if (selectedFile.value.size > MAX_FILE_SIZE) {
    toast.error('File size exceeds the maximum allowed size');
    return;
  }

  const formData = new FormData();
  formData.append('tenantId', 'test');
  formData.append('module', 'test');
  formData.append('fileName', 'test');
  formData.append('file', selectedFile.value.uploadedFile);

  try {
    const response = await uploadFile(formData);
    toast.success("File uploaded successfully")
  } catch (error:any) {
    toast.error(error.message)
  }
};
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
