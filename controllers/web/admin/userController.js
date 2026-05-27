export const getUsersPage = async (req, res) => {
    const { user } = req;

    return res.render('pages/admin/users/usersPage', {
        currentRoute: '/usuarios-sistemas',
        user
    });
};
