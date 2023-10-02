import { Router } from "express";

const ListingController = require("../controllers/listing.controller");

const router = Router();

/**
 * @route POST /api/listings/create
 * @description Create a new listing
 * @access Public
 * 
 * Required fields according to Listing:
 * @param {string} listerId - The ID of the user who created the listing
 * @param {number} price - The price of the listing
 * @param {string} description - The description of the listing
 * @param {string} itemType - The type of item being listed (either "Pet", "Service" or "Product" ONLY)
 * @param {string} saleType - The type of sale (either "Sale", "Adoption", "Subscription" or "Rental" ONLY)
 * @param {array} media - An array of media objects of the format { type: either "image" or "video" ONLY, url: <URL> }
 * 
 * Required fields according to the type of Item being listed:
 * Item Type: Pet
 * @param {string} originId - The ID of the origin country of the animal
 * @param {string} animalType - The type of animal (either "Dog", "Cat", "Rabbit", "Guinea Pig", "Hamster", "Gerbil", "Mouse", "Chinchilla" ONLY)
 * @param {string} gender - The gender of the animal (either "Male" or "Female" ONLY)
 * @param {string} birthdate - The birthdate of the animal
 * 
 * Required fields according to the type of Animal:
 * Pet Type: Dog
 * @param {string} breedId - The ID of the breed of the dog
 * @param {string} size - The size of the dog (either "Small", "Medium" or "Large" ONLY)
 * @param {number} weight - The weight of the dog
 * @param {string} hairCoat - The hair coat of the dog (either "Double", "Silky", "Wire", "Curly", "Hairless", "Long", "Medium" or "Short" ONLY)
 * @param {boolean} isHypoallergenic - Whether the dog is hypoallergenic
 * @param {boolean} isMicrochipped - Whether the dog is microchipped
 * @param {boolean} isNeutered - Whether the dog is neutered
 * @param {boolean} isPottyTrained - Whether the dog is potty trained
 * @param {boolean} isHdbApproved - Whether the dog is HDB approved
 * 
 * Pet Type: Cat (yet to be implemented...)
 * 
 * .
 * .
 * .
 * 
 * Item Type: Service (yet to be implemented...)
 * 
 * Required fields according to the type of Service:
 * Service Type: Grooming (yet to be implemented...)
 * 
 * @returns {object} The created listing in the format { listing: <Listing>, item: <Item> }
 */
router.post("/", ListingController.createListing);

/**
 * @route GET /api/listings/get_all
 * @description Get all listings
 * @access Public
 * @returns {array} An array of all listings in the format { listing: <Listing>, item: <Item> }
 */
router.get("/", ListingController.getAllListings);

/**
 * @route GET /api/listings/get/:id
 * @description Get a listing by ID
 * @access Public
 * @param {string} id - The ID of the listing to retrieve
 * @returns {object} The retrieved listing in the format { listing: <Listing>, item: <Item> }
 */
router.get("/:id", ListingController.getListing);

/**
 * @route PUT /api/listings/update/:id
 * @description Update a listing by ID
 * @access Public
 * @param {string} id - The ID of the listing to update
 * 
 * Mutable fields according to Listing:
 * @param {number} [price] - The price of the listing
 * @param {string} [description] - The description of the listing
 * @param {array} [media] - An array of media objects of the format { type: either "image" or "video" ONLY, url: <URL> }
 * 
 * Mutable fields according to the type of Item being listed:
 * Item Type: Pet
 * @param {string} [gender] - The gender of the animal (either "Male" or "Female" ONLY)
 * @param {string} [birthdate] - The birthdate of the animal
 * 
 * Mutable fields according to the type of Animal:
 * Pet Type: Dog
 * @param {number} [weight] - The weight of the dog
 * @param {boolean} [isMicrochipped] - Whether the dog is microchipped
 * @param {boolean} [isNeutered] - Whether the dog is neutered
 * @param {boolean} [isPottyTrained] - Whether the dog is potty trained
 * 
 * Pet Type: Cat (yet to be implemented...)
 * 
 * .
 * .
 * .
 * 
 * Item Type: Service (yet to be implemented...)
 * 
 * Mutable fields according to the type of Service:
 * Service Type: Grooming (yet to be implemented...)
 * 
 * @returns {object} The updated listing in the format { listing: <Listing>, item: <Item> }
 */
router.put("/:id", ListingController.updateListing);

/**
 * @route DELETE /api/listings/delete/:id
 * @description Delete a listing by ID
 * @access Public
 * @param {string} id - The ID of the listing to delete
 * @returns {object} The deleted listing in the format { listing: <Listing>, item: <Item> }
 */
router.delete("/:id", ListingController.deleteListing);

module.exports = router;