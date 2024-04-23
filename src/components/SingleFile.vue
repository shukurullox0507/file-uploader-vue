<template>
  <div class="single">
    <h2>Single File Upload</h2>
    <label for="upload" class="upload-label">
      <div v-if="selectedFile">
        <template v-if="selectedFile?.type.includes('zip')">
          <img src="../assets/folder_zip.png" alt="zip">
        </template>
        <template v-else-if="selectedFile?.type.includes('html')">
          <img src="../assets/html.png" alt="html">
        </template>
        <template v-else-if="selectedFile?.type.includes('pdf')">
          <img src="../assets/pdf.png" alt="pdf">
        </template>
        <template v-else-if="selectedFile?.type.includes('sql')">
          <img src="../assets/sql.png" alt="sql">
        </template>
        <template v-else>
          <img src="../assets/nomalum.png" alt="other">
        </template>
      </div>
      <svg v-else fill="#000000" width="100px" height="100px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3.793V9H7V3.864L5.914 4.95 4.5 3.536 8.036 0l.707.707.707.707 2.121 2.122-1.414 1.414L9 3.793zM16 11v5H0v-5h2v3h12v-3h2z" fill-rule="evenodd"/>
      </svg>

      <input id="upload" type="file" @change="handleFileUpload">
    </label>
    <div class="fileName">
      <p>{{ selectedFile ? selectedFile.name : 'No file selected' }}</p>
      <button @click="handleUpload">Upload File</button>
    </div>

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
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the maximum allowed size');
      return;
    }
    toast.success('File uploaded successfully')
    selectedFile.value = {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedFile:file
    };
  }
};

const handleUpload = async () => {
  if (!selectedFile.value) {
    console.error('No file selected');
    return;
  }

  const formData = new FormData();
  formData.append('tenantId', 'test');
  formData.append('module', 'test');
  formData.append('fileName', 'test');
  formData.append('file', selectedFile.value.uploadedFile); // Append the file here

  try {
    const response = await uploadFile(formData);
    console.log('File uploaded:', response);
  } catch (error:any) {
    console.error(error.message);
  }
};
</script>

<style scoped lang="scss">
.upload-label {
  cursor: pointer;
}

#upload {
  display: none;
}

button {
  margin-left: 20px;
  padding: 5px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

svg {
  width: 100px;
  height: 100px;
}

img {
  width: 100px;
  height: 100px;
}
.fileName{
  display: flex;
}
</style>
