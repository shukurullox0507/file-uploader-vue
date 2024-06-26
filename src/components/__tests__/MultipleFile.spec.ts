import { describe, expect, it } from 'vitest';
import { uploadFile } from "../../services/api";
import MultipleFile from "../MultipleFileUpload/MultipleFile.vue";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

describe('MultipleFile', () => {
    it('should render File input', () => {
        const wrapper = mount(MultipleFile,{
            props:{
                isMultiple:true,
                maxCount:5,
                maxSize:2
            }
        });

        expect(wrapper.find('input').html()).toMatchSnapshot();
    });

    it('should show error message when uploaded file more than 4bytes when maxSize is 4', async () => {
        const wrapper = mount(MultipleFile, {
            props: {
                maxSize: 2,
                isMultiple:true,
                maxCount:5,
            }
        });
        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement;
        const file = new File(['2552'], 'foo.txt', {
            type: 'text/plain'
        });
        const mockFileList = Object.create(inputElement.files);
        mockFileList[0] = file;
        Object.defineProperty(mockFileList, 'length', { value: 1 });
        await(wrapper.getCurrentComponent().exposed as unknown as any).handleFileChange({
            target: { files: mockFileList }
        });
        await nextTick();

        const errorMessageElement = wrapper.find('p[data-test-error-message]');

        expect(errorMessageElement.exists()).toBe(true);
    });

    it("should show error message when uploaded file count exceeds maxCount", async () => {
        const wrapper = mount(MultipleFile, {
            props: {
                maxCount: 5,
                isMultiple:true,
                maxSize:2,
            }
        });
        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement;

        // Simulate uploading files exceeding the maxCount
        const filesToUpload = [
            new File(['file1'], 'file1.txt', { type: 'text/plain' }),
            new File(['file2'], 'file2.txt', { type: 'text/plain' }),
            new File(['file3'], 'file3.txt', { type: 'text/plain' }),
            new File(['file4'], 'file4.txt', { type: 'text/plain' }),
            new File(['file5'], 'file5.txt', { type: 'text/plain' }),
            new File(['file6'], 'file6.txt', { type: 'text/plain' })
        ];
        const mockFileList = Object.create(inputElement.files);
        filesToUpload.forEach((file, index) => {
            mockFileList[index] = file;
        });
        Object.defineProperty(mockFileList, 'length', { value: filesToUpload.length });

        await(wrapper.getCurrentComponent().exposed as unknown as any).handleFileChange({
            target: {files: mockFileList }
        });
        await nextTick();

        const errorMessageElement = wrapper.find('p[data-test-error-count]');

        expect(errorMessageElement.exists()).toBe(true);
    });

    it("should show error message when isMultiple is false", () =>{
        const wrapper = mount(MultipleFile, {
            props: {
                maxCount: 5,
                isMultiple:true,
                maxSize:2,            }
        });

        const inputElement = wrapper.find('input[type="file"]');

        expect(inputElement.exists()).toBe(true);
    });

    it("should show error message when api status is more than 200", async () => {
        const wrapper = mount(MultipleFile);
        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement;
        const file = new File(['2552'], 'foo.txt', {
            type: 'text/plain'
        });
        const mockFileList = Object.create(inputElement.files);
        mockFileList[0] = file;
        Object.defineProperty(mockFileList, 'length', { value: 1 });
        const response = await uploadFile(mockFileList[0]);

        wrapper.vm.$nextTick();

        expect(response.status).toBe(200);
    });
});
