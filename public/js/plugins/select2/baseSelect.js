import { initMdbWrapperInput, updateMdbWrapperInput } from "../mdb/baseInstance.js";

export const initbaseSelect2 = ({ 
    baseSelector, 
    modalSelector,
    url, 
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
            url: url, 
            dataType: 'json', 
            delay: 250, 
            data, 
            processResults: processResults 
        },
        tags,
        createTag
    });

    $(baseSelector).on('select2:opening', () => {
        $(baseSelector).find('option').remove();
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