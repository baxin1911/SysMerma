export const getProfilePage = async (req, res) => {

    const { user } = req;

    return res.render('pages/admin/profiles/profilesPage', {
        currentRoute: '/perfiles',
        user
    });
}