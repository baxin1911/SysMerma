export const getResponsiveRowData = (datatable, element) => {

    let tr = $(element).closest('tr');

    if (tr.hasClass('child')) {
        tr = tr.prev();
    }

    return datatable.row(tr).data();
};