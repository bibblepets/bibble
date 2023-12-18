import { Router } from "express";
import * as ListingController from "../controllers/listing.controller";

const router = Router();

/**
 * @route POST /api/pet-listings
 * @desc Create a new pet listing
 * @access Private
 */
router.post("/", ListingController.createListing);

/**
 * @route GET /api/pet-listings
 * @desc Get all pet listings
 * @access Public
 */
router.get("/", ListingController.getAllListings);

/**
 * @route GET /api/pet-listings/species/:species
 * @desc Get all pet listings for a specific species
 * @access Public
 */
router.get("/species/:species", ListingController.getAllListingsBySpecies);

/**
 * @route GET /api/pet-listings/:id
 * @desc Get a pet listing by ID
 * @access Public
 */
router.get("/:id", ListingController.getListingById);

/**
 * @route PUT /api/pet-listings/:id
 * @desc Update a pet listing by ID
 * @access Private
 */
router.put("/:id", ListingController.updateListingById);

/**
 * @route DELETE /api/pet-listings/:id
 * @desc Delete a pet listing by ID
 * @access Private
 */
router.delete("/:id", ListingController.deleteListingById);


module.exports = router;