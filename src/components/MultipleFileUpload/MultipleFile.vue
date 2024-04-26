<script setup lang="ts">
import { ref, defineProps, defineExpose } from 'vue';
import { uploadFile } from '@/services/api';
import { useToast } from 'vue-toast-notification';

interface CustomFile {
  name: string;
  type: string;
  size: number;
  status: number;
  uploadedFiles: FileList;
  errorMessage: string | undefined;
}

// Define props using defineProps
const props = withDefaults(
    defineProps<{
      maxSize?:number,
      maxCount?:number,
      isMultiple?:boolean,
    }>(),
    {
      maxSize: 20 * 1024 * 1024,
      maxCount: 5,
      isMultiple:true,
    }
)

const selectedFiles = ref<CustomFile[]>([]);

const handleFileChange = (event: { target: { files: FileList } }) => {
  const files = event.target.files;
  if (!files) return;
  const filesToAdd = Array.from(files).slice(0, props.maxCount - selectedFiles.value.length);

  filesToAdd.forEach(file => {
    const errorMessage = file.size >= props.maxSize ? "File is too large" : undefined;
    selectedFiles.value.push({
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedFiles: files,
      status: 0,
      errorMessage,
    });
  });
};

const handleRemoveFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const handleUpload = async () => {
  for (const file of selectedFiles.value) {
    if (file.status === 1) {
      continue;
    }

    if (file.size > props.maxSize) {
      file.status = 2;
    } else {
      try {
        const response = await uploadFile(file.uploadedFiles[0]);
        file.status = 1;

      } catch (error: any) {
        file.status = 3;
      }
    }
  }
};
//
// const truncateFileName = (fileName: string, maxLength: number): string => {
//   if (fileName.length > maxLength) {
//     return fileName.substring(0, maxLength - 3) + '...';
//   }
//   return fileName;
// };

defineExpose({ handleFileChange });
</script>

<template data-test-error-message>
  <div class="multiple">
    <h2>Multiple File Upload</h2>
    <div class="single-file">
      <p  data-test-error-count>You can upload {{props.maxCount - selectedFiles.length}} files</p>
      <p ></p>
      <div class="uploaded-files">
        <template v-for="(file, index) in selectedFiles">
          <div class="file-item">
            <img src="../icons/img.png" alt="" @click.stop="handleRemoveFile(index)" class="remove-file">
            <img v-if="file.type.includes('zip')" src="../../assets/folder_zip.png" class="file-icons" alt="zip">
            <img v-else-if="file.type.includes('html')" src="../assets/html.png" class="file-icons"  alt="html">
            <img v-else-if="file.type.includes('pdf')" src="../../assets/pdf.png" class="file-icons" alt="pdf">
            <img v-else-if="file.type.includes('sql')" src="../../assets/sql.png" class="file-icons" alt="sql">
            <img v-else src="../../assets/nomalum.png" class="file-icons" alt="other">
            <img src="../../assets/done.png" alt="done" class="done-icon" v-if="file.status === 1">
            <img src="../../assets/error.png" alt="error" class="error-icon" v-else-if="file.status === 2">
          </div>
          <p v-if="file.errorMessage" data-test-error-message class="error-message">{{file.errorMessage}}</p>

        </template>

        <div class="upload-container">
          <label for="uploadInput" class="upload-label">

            <svg fill="#000000" width="100px" height="100px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3.793V9H7V3.864L5.914 4.95 4.5 3.536 8.036 0l.707.707.707.707 2.121 2.122-1.414 1.414L9 3.793zM16 11v5H0v-5h2v3h12v-3h2z" fill-rule="evenodd"/>
            </svg>
            <input id="uploadInput" type="file" :multiple="props.isMultiple" @change="handleFileChange">
          </label>
          <p>Tap to choose files</p>
        </div>
      </div>
    </div>
    <div class="fileName">
      <button @click="handleUpload" v-if="selectedFiles.length>0">Upload File</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './style.scss';
</style>
