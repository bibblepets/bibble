import { Router } from "express";

const PetListingController = require("../controllers/pet-listing.controller");

const router = Router();

router.post("/", PetListingController.createPetListing);
router.get("/", PetListingController.getAllPetListings);
router.get("/species/:species", PetListingController.getAllPetListingsBySpecies);
router.get("/:id", PetListingController.getPetListingById);
router.put("/:id", PetListingController.updatePetListingById);
router.delete("/:id", PetListingController.deletePetListingById);

module.exports = router;