<script setup lang="ts">
import {ref} from 'vue';
import { uploadFile } from '@/services/api';
import {FileType} from "@/utils/FileType";
import {STATUS} from "@/constants/status";

interface CustomFile {
  name: string;
  type: string;
  size: number;
  status:number;
  uploadedFile: File;
  errorMessage: string | undefined;
  img: string;
}

const selectedFile = ref<CustomFile | null>(null);

interface Props{
  maxSizeFile: number,
  fileType: string[],
}
const props = defineProps<Props>()

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    const errorMessage= file.size >= props.maxSizeFile? 'File is too large' :undefined;
    selectedFile.value = {
      name: file.name,
      type: file.type,
      size: file.size,
      status:0,
      img: FileType(file),
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
    selectedFile.value.status = STATUS.error;
    return;
  }
  try {
    selectedFile.value.status = STATUS.success;
    return await uploadFile(selectedFile.value.uploadedFile);
  } catch (error: any) {
    selectedFile.value.status = STATUS.error;
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
          <img :src="selectedFile.img" alt="" class="file-icon"/>
          <img src="../../assets/done.png" alt="done" class="status-icon" v-if="selectedFile.status === STATUS.success">
          <img src="../../assets/error.png" alt="error" class="status-icon" v-else-if="selectedFile.status === STATUS.error">
        </div>
        <svg v-else fill="#000000" width="100px" height="100px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 3.793V9H7V3.864L5.914 4.95 4.5 3.536 8.036 0l.707.707.707.707 2.121 2.122-1.414 1.414L9 3.793zM16 11v5H0v-5h2v3h12v-3h2z" fill-rule="evenodd"/>
        </svg>
        <input id="upload" type="file" @change="handleFileUpload($event)">
      </label>
      <p v-if="!selectedFile" >Tap to choose file</p>
      <p v-if="selectedFile?.errorMessage" data-test-error-message ></p>
    </div>
    <button v-if="selectedFile" @click="handleUpload" >Upload File</button>
  </div>
</template>

<style scoped lang="scss">
@import './style.scss';
</style>
