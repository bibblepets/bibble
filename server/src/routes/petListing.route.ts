import { Router } from "express";

const PetListingController = require("../controllers/petListing.controller");

const router = Router();

/**
 * @route POST /api/pet-listings
 * @desc Create a new pet listing
 * @access Private
 */
router.post("/", PetListingController.createPetListing);

/**
 * @route GET /api/pet-listings
 * @desc Get all pet listings
 * @access Public
 */
router.get("/", PetListingController.getAllPetListings);

/**
 * @route GET /api/pet-listings/species/:species
 * @desc Get all pet listings for a specific species
 * @access Public
 */
router.get("/species/:species", PetListingController.getAllPetListingsBySpecies);

/**
 * @route GET /api/pet-listings/:id
 * @desc Get a pet listing by ID
 * @access Public
 */
router.get("/:id", PetListingController.getPetListingById);

/**
 * @route PUT /api/pet-listings/:id
 * @desc Update a pet listing by ID
 * @access Private
 */
router.put("/:id", PetListingController.updatePetListingById);

/**
 * @route DELETE /api/pet-listings/:id
 * @desc Delete a pet listing by ID
 * @access Private
 */
router.delete("/:id", PetListingController.deletePetListingById);


module.exports = router;