export const getMovementPage = async (req, res) => {

    const { user } = req;

    return res.render('pages/admin/movements/movementsPage', {
        currentRoute: '/movimientos',
        user
    });
}