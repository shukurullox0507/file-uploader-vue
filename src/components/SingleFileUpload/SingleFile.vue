<script setup lang="ts">
import { ref } from 'vue';
import { uploadFile } from '@/services/api';

interface CustomFile {
  name: string;
  type: string;
  size: number;
  status:number;
  uploadedFile: File;
  errorMessage: string | undefined;
}

const selectedFile = ref<CustomFile | null>(null);
const props = withDefaults(
    defineProps<{
      maxSizeFile?: number,
      fileType?: string[],
    }>(),
    {
      maxSizeFile: 4 * 1024 * 1024,
      fileType:undefined,
    }
)

const handleFileUpload = (event: { target: { files: any } }) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    const errorMessage= file.size >= props.maxSizeFile? 'File is too large' :undefined;
    selectedFile.value = {
      name: file.name,
      type: file.type,
      size: file.size,
      status:0,
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
    selectedFile.value.status = 2;
    return;
  }

  try {
    selectedFile.value.status = 1;
    return await uploadFile(selectedFile.value.uploadedFile);
  } catch (error: any) {
    selectedFile.value.status = 2;
  }
};

defineExpose({ handleFileUpload });
</script>


<template>
  <div class="single">
    <h2>Single File Upload</h2>
    <div class="upload-container">
      <label :id="selectedFile?.type ? 'data-test-mime-type' : undefined" for="upload" class="upload-label-file">
        <div v-if="selectedFile" >
          <img v-if="selectedFile?.type.includes('zip')" src="../../assets/folder_zip.png" alt="zip">
          <img v-else-if="selectedFile?.type.includes('html')" src="../assets/html.png" alt="html">
          <img v-else-if="selectedFile?.type.includes('pdf')" src="../../assets/pdf.png" alt="pdf">
          <img v-else-if="selectedFile?.type.includes('sql')" src="../../assets/sql.png" alt="sql">
          <img v-else src="../../assets/nomalum.png" alt="other">
          <img src="../../assets/done.png" alt="done" class="done-icon" v-if="selectedFile.status === 1">
          <img src="../../assets/error.png" alt="error" class="error-icon" v-else-if="selectedFile.status === 2">
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
