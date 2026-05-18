import { handleApiError, normalizeJqAjaxError } from "../../api/errorHandler.js";
import { initMdbWrapperInput, updateMdbWrapperInput } from "../mdb/baseInstance.js";

const wrapperSelector = '#presentationDisplayInput';

export const initbaseSelect2 = ({ 
    baseSelector, 
    modalSelector,
    get, 
    clearOnOpen = true,
    placeholder,
    processResults,
    data = (params) => {
        return {
            search: params.term
        };
    },
    tags = false,
    createTag = (params) => {

        return {
            id: params.term,
            text: params.term
        };
    }
}) => {

    if ($(baseSelector).hasClass("select2-hidden-accessible")) $(baseSelector).select2('destroy');


    $(baseSelector).select2({ 
        language: 'es',
        placeholder: placeholder, 
        dropdownParent: $(modalSelector),
        minimumInputLength: 0, 
        ajax: {  
            dataType: 'json', 
            delay: 250, 
            data, 
            processResults,
            transport: async (params, success, failure) => {

                try {

                    const response = await get(params.data);

                    return success(response.data);

                } catch (err) {

                    handleApiError({
                        err,
                        rethrow: false
                    });

                    failure(err);
                }
            }
        },
        tags,
        createTag
    });

    if (clearOnOpen) $(baseSelector).on('select2:opening', () => {

        $(baseSelector).val(null).trigger('change');

        setMdbWrapperInputValue({
            selector: `${ modalSelector } ${ wrapperSelector }`,
            value: ''
        });
    });
}

export const toggleSelectOption = ({ selector, data = null }) => {
    
    $(selector).val(null).trigger('change');

    const { id, text } = data || {};

    if (!text || !id) return;

    const option = new Option(text, id, true, true);

    Object.entries(data).forEach(([key, value]) => {
        option.dataset[key] = value;
    });

    $(selector).append(option).trigger('change');
};

export const setMdbWrapperInputValue = ({
    selector, 
    value
}) => {

    const instance = initMdbWrapperInput({
        selector,
        value
    });

    updateMdbWrapperInput(instance);
}

export const bindDependency = ({
    sourceSelector,
    onChange
}) => {

    const $source = $(sourceSelector);

    if (!$source.length) return;

    const source = $source[0];

    if (source.dataset.bound === 'true') return;

    source.dataset.bound = 'true';

    $source.on('change', () => {

        onChange?.({
            value: $source.val(),
            source: $source
        });
    });
};