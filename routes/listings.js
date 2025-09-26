import express from "express";
import Listing from "../Models/Listings.js";
import wrapAsync from "../utils/wrapAsync.js";

import Booking from "../Models/Booking.js";
import {isLoggedIn, isOwner, validateListing} from "../middleware.js";

import listingController from "../controllers/listings.js"
import { render } from "ejs";

import multer from "multer";
import {storage} from "../cloudConfig.js";

// Initialize multer with cloudinary storage
const upload = multer({ storage });

const router = express.Router();

//common path route and their methods
router  
  .route('/')
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing))




//GET => Show the "New Listing" form
router.get('/new',listingController.renderNewForm );

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing))




//GET => form will display a listing with their value
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


//Booking Simulation
router.get("/:id/bookings/payment",isLoggedIn,wrapAsync(listingController.showBooking));
router.post("/:id/bookings/payment",isLoggedIn, wrapAsync(listingController.makePayment));

router.get('/:id/success', wrapAsync(listingController.showSuccessPayment));

router.get("/:id/cancel", (req, res) => {
  req.flash("error", "Payment canceled.");
  return res.redirect("/listings");
});

export default router;

// if that date is exist in db that means the booking has been done by other user and we cannot select that date so we'll grey out that date so users can see that they cannot book that