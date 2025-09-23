import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";

import Listing from "../Models/Listings.js";
import Review from "../Models/Review.js";
import {validateReview, isLoggedIn, isReviewAuthor} from "../middleware.js"

import reviewController from "../controllers/review.js"
const router = express.Router({ mergeParams: true });

//Review
//Post Review Route
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete('/:reviewId', isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview)); 

export default router;