<template>
  <div class="single">
    <h2>Multiple File Upload</h2>
    <div class="single-file">
      <div v-if="selectedFiles.length > 0" class="uploaded-files">
        <template v-for="(file, index) in selectedFiles">
            <div class="file-item">
              <img src="./icons/img.png" alt="" @click.stop="handleRemoveFile(index)" class="remove-file">
              <img v-if="file.type.includes('zip')" src="../assets/folder_zip.png" alt="zip">
              <img v-else-if="file.type.includes('html')" src="../assets/html.png" alt="html">
              <img v-else-if="file.type.includes('pdf')" src="../assets/pdf.png" alt="pdf">
              <img v-else-if="file.type.includes('sql')" src="../assets/sql.png" alt="sql">
              <img v-else src="../assets/nomalum.png" alt="other">
              <p style="max-width: 100px">{{ truncateFileName(file.name, 15) }}</p>
            </div>
        </template>
      </div>
      <label for="uploadInput" class="upload-label">
      <svg fill="#000000" width="100px" height="100px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M9 3.793V9H7V3.864L5.914 4.95 4.5 3.536 8.036 0l.707.707.707.707 2.121 2.122-1.414 1.414L9 3.793zM16 11v5H0v-5h2v3h12v-3h2z"
              fill-rule="evenodd"/>
        </svg>

        <input id="uploadInput" type="file" multiple @change="handleFileChange">
      </label>
    </div>
    <div class="fileName">
      <button @click="handleUpload">Upload File</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadFile } from '@/services/api';
import { useToast } from 'vue-toast-notification';

interface CustomFile {
  name: string;
  type: string;
  size: number;
  status:number;
  uploadedFiles: FileList;
}

const selectedFiles = ref<CustomFile[]>([]);
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20mb
const toast = useToast();

const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement)?.files;
  if (files) {
    Array.from(files).forEach(file => {
      selectedFiles.value.push({
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedFiles: files,
        status: 0,
      });
    });
  }

};

const handleRemoveFile = (index: number) => {
  selectedFiles.value.splice(index, 1);

};

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) {
    console.error('No file selected');
    return;
  }

  for (const file of selectedFiles.value) {
    const formData = new FormData();
    const index = selectedFiles.value.indexOf(file);
    formData.append('tenantId', 'test');
    formData.append('module', 'test');
    formData.append('fileName', 'test');
    formData.append(`file`, file.uploadedFiles[index]);
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the maximum allowed size');
      file.status = 2
      return;
    }
    try {
      const response = await uploadFile(formData);
      toast.success("File uploaded successfully")
        file.status = 1;
      console.log('Files uploaded:', response);
    } catch (error: any) {
      console.error(error.message);
      file.status = 3;

    }
    console.log(file.status)
  }


};

// Truncate file name if it exceeds max length
const truncateFileName = (fileName: string, maxLength: number): string => {
  if (fileName.length > maxLength) {
    return fileName.substring(0, maxLength - 3) + '...';
  }
  return fileName;
};
</script>

<style scoped lang="scss">
.upload-label {
  cursor: pointer;
}

#uploadInput {
  display: none;
}

button {
  margin-top: 20px;
  padding: 8px 16px;
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

.fileName {
  display: flex;
}

.uploaded-files {
  display: flex;
  flex-wrap: wrap;
}

.file-item {
  margin: 10px;
  text-align: center;
  height: 100px;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.remove-file{
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
}

.file-item p {
  margin-top: 5px;
  font-size: 12px;
}
.single-file{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-items: center;
  align-items: center;
}
</style>
