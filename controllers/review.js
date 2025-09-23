import Review from "../Models/Review.js";
import Listing from "../Models/Listings.js";

const createReview = async (req, res)=>{
  let id = req.params.id;
  let listing = await Listing.findById(id);     // fetch listing from MongoDB
  let review = req.body.review;                 // review object
  let newReview = new Review(review);          // create new Review model
  newReview.author = req.user._id;
  
  //console.log(newReview)
  listing.reviews.push(newReview);              // push reference into listing

  await newReview.save();  // creates a new document in reviews collection
  await listing.save();    // updates listing document with review ref
  req.flash("success", "New Review Created")
  res.redirect(`/listings/${listing._id}`)
}

const destroyReview = async (req,res) =>{
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted")
  res.redirect(`/listings/${id}`)
}

export default {createReview, destroyReview}