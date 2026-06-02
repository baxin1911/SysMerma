import { createProfileDTO } from "../../../dtos/profileDTO.js";
import { createProfile, findAllProfiles, updateProfile } from "../../../services/admin/profileService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from "../../../utils/requestQueryUtils.js";

const allowedDepartments = ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS'];

export const getAllProfiles = async (req, res) => {

    const rawDepartment =
        req.query.department ??
        req.query['department[]'];
    const strictDepartmentFilter = req.query.strictDepartmentFilter === 'true';
    const includeDepartments = req.query.includeDepartments === 'true';
    const { user } = req;
    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);

    const columns = ['fullName', null, null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const userDepartments = (user?.accesses || [])
        .map(access => access.department)
        .filter(Boolean);
    const canViewAllProfiles = userDepartments.some(departmentName =>
        allowedDepartments.includes(departmentName)
    );

    const departmentFilters = Array.isArray(rawDepartment)
        ? rawDepartment
        : rawDepartment
            ? [rawDepartment]
            : [];

    const shouldUseExplicitDepartmentFilters = strictDepartmentFilter || departmentFilters.length > 0;

    const departments = shouldUseExplicitDepartmentFilters
        ? departmentFilters
        : (canViewAllProfiles ? [] : userDepartments);

    const result = await findAllProfiles({
        departments,
        skip,
        take,
        search,
        orderBy,
        orderDir,
        includeDepartments
    });

    res.status(200).json(result);
}

export const registerProfile = async (req, res) => {

    const profileDto = createProfileDTO(req.body);
    const sanitizedProfileDto = sanitizeEmptyStrings(profileDto);

    const profile = await createProfile({ profileDto: sanitizedProfileDto });

    return res.status(201).json(profile);
}

export const editProfile = async (req, res) => {

    const { id } = req.params;
    const profileDto = createProfileDTO(req.body);
    const sanitizedProfileDto = sanitizeEmptyStrings(profileDto);

    const profile = await updateProfile({ id, profileDto: sanitizedProfileDto });

    return res.status(200).json(profile);
}
