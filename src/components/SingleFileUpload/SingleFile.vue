<script setup lang="ts">
import { ref } from 'vue';
import { uploadFile } from '@/services/api';
import { useToast } from 'vue-toast-notification';

interface CustomFile {
  name: string;
  type: string;
  size: number;
  uploadedFile: File;
  errorMessage: string | undefined;
}

const selectedFile = ref<CustomFile | null>(null);
const props = withDefaults(
    defineProps<{
      maxSizeFile?: number
    }>(),
    {
      maxSizeFile: 4 * 1024 * 1024
    }
)
const toast = useToast();

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  const errorMessage= file.size >= props.maxSizeFile? 'File is too large' :undefined;
  if (file) {
    selectedFile.value = {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedFile: file,
      errorMessage
    };
  }
};

const handleUpload = async () => {
  if (!selectedFile.value) {
    return;
  }

  if (selectedFile.value.size > props.maxSizeFile) {
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
    toast.success("File uploaded successfully");
  } catch (error: any) {
    toast.error(error.message);
  }
};

defineExpose({ handleUpload });
</script>


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
      <p v-if="!selectedFile" >Tap to choose file</p>
      <p v-if="selectedFile?.errorMessage" data-test-error-message >{{selectedFile?.errorMessage}}</p>
    </div>
    <button v-if="selectedFile" @click="handleUpload" >Upload File</button>
  </div>
</template>

<style scoped lang="scss">
@import './style.scss';
</style>
