import { describe, expect, it } from 'vitest';
import { uploadFile } from "../../services/api";
import MultipleFile from "../MultipleFileUpload/MultipleFile.vue";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

describe('MultipleFile', () => {
    it('should render File input', () => {
        const wrapper = mount(MultipleFile);

        expect(wrapper.find('input').html()).toMatchSnapshot();
    });

    it('should show error message when uploaded file more than 4bytes when maxSize is 4', async () => {
        const wrapper = mount(MultipleFile, {
            props: {
                maxSize: 2
            }
        })
        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement
        const file = new File(['2552'], 'foo.txt', {
            type: 'text/plain'
        })
        const mockFileList = Object.create(inputElement.files)
        mockFileList[0] = file
        Object.defineProperty(mockFileList, 'length', { value: 1 })
        ;(wrapper.getCurrentComponent().exposed as unknown as any).handleFileChange({
            target: { files: mockFileList }
        })
        await nextTick()

        const errorMessageElement = wrapper.find('p[data-test-error-message]')

        expect(errorMessageElement.exists()).toBe(true)
    })
});

