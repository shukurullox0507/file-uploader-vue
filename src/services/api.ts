import axios from 'axios';

const baseURL = 'http://192.168.100.241:9999/api';

const api = axios.create({
    baseURL,
});

export async function uploadFile(file:File): Promise<any> {
    const formData = new FormData();
    formData.append('tenantId', 'test');
    formData.append('module', 'test');
    formData.append('fileName', 'test');
    formData.append('file', file);
    try {
        return await api.post('/file/upload/public', formData);
    } catch (error:any) {
        throw new Error('Error uploading file: ' + error.message);
    }
}
