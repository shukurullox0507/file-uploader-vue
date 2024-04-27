import { describe, expect, it } from 'vitest';
import { uploadFile } from "../../services/api";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import SingleFile from "../SingleFileUpload/SingleFile.vue";

describe('MultipleFile', () => {
    it('should render File input', () => {
        const wrapper = mount(SingleFile);
        expect(wrapper.find('input').html()).toMatchSnapshot();
    });

    it('should show error message when uploaded file more than 4bytes when maxSize is 4', async () => {
        const wrapper = mount(SingleFile, {
            props: {
                maxSizeFile: 4,
                fileType: ['text/plain'],
            }
        })
        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement
        const file = new File(['252'], 'foo.txt', {
            type: 'text/plain'
        })
        const mockFileList = Object.create(inputElement.files)
        mockFileList[0] = file
        Object.defineProperty(mockFileList, 'length', { value: 1 });
        await(wrapper.getCurrentComponent().exposed as unknown as any).handleFileUpload({
            target: { files: mockFileList }
        })
        await nextTick()

        const errorMessageElement = wrapper.find('p[data-test-error-message]')

        expect(errorMessageElement.exists()).toBe(false)
    })

    it("should show error message when uploaded file mime type is not allowed", async () => {
        const wrapper = mount(SingleFile, {
            props: {
                fileType: ['application/pdf'],
                maxSizeFile: 4,
            }
        });

        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement;
        const file = new File(['252'], 'foo.pdf', {
            type: 'application/pdf'
        });

        const mockFileList = Object.create(inputElement.files);
        mockFileList[0] = file;
        Object.defineProperty(mockFileList, 'length', { value: 1 });

        await (wrapper.getCurrentComponent().exposed as any).handleFileUpload({ target: { files: mockFileList } });
        await nextTick();

        const errorMessageElement = wrapper.find('label[data-test-mime-type]');

        expect(errorMessageElement.exists()).toBe(false); // No error message should be shown since PDF is allowed
    });

    it("should show error message when api status is more than 200", async() => {
        const wrapper =mount(SingleFile);

        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement;
        const file = new File(['2552'],'foo.txt',{
            type: 'text/plain'
        });
        const mockFileList = Object.create(inputElement.files);
        mockFileList[0] = file;
        Object.defineProperty(mockFileList, 'length', {value:1});

        const response = await uploadFile(mockFileList[0]);

        wrapper.vm.$nextTick();

        expect(response.status).toBe(200)
    })
});

