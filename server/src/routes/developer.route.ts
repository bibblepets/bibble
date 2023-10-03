import { Router } from "express";

const BreedController = require("../controllers/breed.controller");
const CountryController = require("../controllers/country.controller");
const VaccineController = require("../controllers/vaccine.controller");

const ProfileController = require("../controllers/profile.controller");

const router = Router();

router.post('/breed/:species', BreedController.createBreed);
router.post('/breed/dump/:species', BreedController.createBreeds);
router.get('/breed/:species', BreedController.getBreedsBySpecies);

router.post('/country', CountryController.createCountry);
router.get('/country', CountryController.getAllCountries);

router.post('/vaccine/:species', VaccineController.createVaccine);
router.post('/vaccine/dump/:species', VaccineController.createVaccines);
router.get('/vaccine/:species', VaccineController.getVaccinesBySpecies);

router.post('/profile', ProfileController.createProfile);

module.exports = router;
