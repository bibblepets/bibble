import { Router } from "express";

const ListingController = require("../controllers/listing.controller");

const router = Router();

router.post("/create", ListingController.createListing);
router.get("/get_all", ListingController.getAllListings);
router.get("/get/:id", ListingController.getListing);
router.put("/update/:id", ListingController.updateListing);
router.delete("/delete/:id", ListingController.deleteListing);

module.exports = router;