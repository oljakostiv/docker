const router = require('express')
    .Router();

const { carsController } = require('../controllers');
const {
    constants: {
        BODY,
        CAR_ID,
        ID,
        QUERY,
        PARAMS
    }
} = require('../config');
const { CarModel } = require('../dataBase');
const {
    carMiddle,
    mainMiddle
} = require('../middlewares');
const {
    carValidator: {
        queryCarValidator,
        updateCarValidator,
        paramsCarValidator,
        createCarValidator
    }
} = require('../validators');

router.get('/',
    mainMiddle.isDataValid(queryCarValidator, QUERY),
    carsController.getAllCars);

router.post('/',
    mainMiddle.isDataValid(createCarValidator, BODY),
    carMiddle.checkUniqueModel,
    carsController.setCar);

router.delete('/:car_id',
    mainMiddle.isDataValid(paramsCarValidator),
    mainMiddle.getItemByDynamicParam(CarModel, CAR_ID, PARAMS, ID),
    carsController.deleteCar);

router.get('/:car_id',
    mainMiddle.isDataValid(paramsCarValidator),
    mainMiddle.getItemByDynamicParam(CarModel, CAR_ID, PARAMS, ID),
    carsController.getSingleCar);

router.put('/:car_id',
    mainMiddle.isDataValid(paramsCarValidator),
    mainMiddle.isDataValid(updateCarValidator, BODY),
    carMiddle.checkUniqueModel,
    carsController.updateCar);

module.exports = router;
