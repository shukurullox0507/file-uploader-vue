import axios from 'axios';

const baseURL = 'http://192.168.100.241:9999/api';

const api = axios.create({
    baseURL,
});

export async function uploadFile(formData: FormData): Promise<any> {
    try {
        const response = await api.post('/file/upload/public', formData);
        return response.data;
    } catch (error:any) {
        throw new Error('Error uploading file: ' + error.message);
    }
}
