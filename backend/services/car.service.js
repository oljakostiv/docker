const { CarModel } = require('../dataBase');

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
        const yearFilter = {};

        Object.keys(filters)
            .forEach((filterParam) => {
                switch (filterParam) {
                    case 'model': {
                        filterObject.model = {
                            $regex: `^${filters[filterParam]}`,
                            $options: 'gi'
                        };
                        break;
                    }
                    case 'year_lte': {
                        Object.assign(yearFilter, { $lte: +filters[filterParam] });
                        break;
                    }
                    case 'year_gte': {
                        Object.assign(yearFilter, { $gte: +filters[filterParam] });
                        break;
                    }
                    default: {
                        filterObject[filterParam] = filters[filterParam];
                    }
                }
            });

        if (Object.keys(yearFilter).length) {
            filterObject.year = yearFilter;
        }

        const cars = await CarModel.find(filterObject)
            .sort({ [sortBy]: orderBy })
            .limit(+perPage)
            .skip((page - 1) * perPage);

        return cars;
    }
};
