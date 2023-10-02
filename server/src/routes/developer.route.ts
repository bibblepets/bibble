import { Router } from "express";

const BreedController = require("../controllers/breed.controller");
const CountryController = require("../controllers/country.controller");
const VaccineController = require("../controllers/vaccine.controller");

const router = Router();

router.post('/breed/:animal', BreedController.createBreed);
router.get('/breed/:animal', BreedController.getBreedsByAnimal);

router.post('/country', CountryController.createCountry);
router.get('/country', CountryController.getAllCountries);

router.post('/vaccine/:animal', VaccineController.createVaccine);
router.get('/vaccine/:animal', VaccineController.getVaccinesByAnimal);

module.exports = router;
