import { Router } from "express";

const BreedController = require("../controllers/breed.controller");
const CountryController = require("../controllers/country.controller")

const router = Router();

router.post('/breed/create', BreedController.createBreed);
router.get('/breed/get_all', BreedController.getAllBreeds);
router.get('/breed/get/:animal', BreedController.getBreedsByAnimal);

router.post('/country/create', CountryController.createCountry);
router.get('/country/get_all', CountryController.getAllCountries);

module.exports = router;
