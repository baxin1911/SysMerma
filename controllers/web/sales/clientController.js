export const getClientPage = async (req, res) => {

    const { user } = req;

    return res.render('pages/sales/clients/clientsPage', {
        currentRoute: '/clientes',
        user
    });
}