const { constants: { SEPARATOR } } = require('../config');
const { UserModel } = require('../dataBase');

module.exports = {
    getAll: async (query = {}) => {
        const {
            perPage = 5,
            page = 1,
            sortBy = 'createdAt',
            order = 'asc',
            ...filters
        } = query;

        const orderBy = order === 'asc' ? -1 : 1;

        const filterObject = {};
        const ageFilter = {};

        Object.keys(filters)
            .forEach((filterParam) => {
                switch (filterParam) {
                    case 'role': {
                        const rolesArr = filters.role.split(SEPARATOR);
                        filterObject.role = { $in: rolesArr };
                        break;
                    }
                    case 'name': {
                        filterObject.name = {
                            $regex: `^${filters.name}`,
                            $options: 'gi'
                        };
                        break;
                    }
                    case 'born_year_lte': {
                        Object.assign(ageFilter, { $lte: +filters[filterParam] });
                        break;
                    }
                    case 'born_year_gte': {
                        Object.assign(ageFilter, { $gte: +filters[filterParam] });
                        break;
                    }
                    default: {
                        filterObject[filterParam] = filters[filterParam];
                    }
                }
            });

        if (Object.keys(ageFilter).length) {
            filterObject.born_year = ageFilter;
        }

        const users = await UserModel.find(filterObject)
            .sort({ [sortBy]: orderBy })
            .limit(+perPage)
            .skip((page - 1) * perPage);

        return users;
    }
};
