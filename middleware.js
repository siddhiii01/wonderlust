import Listing from "./Models/Listings.js";
import Review from "./Models/Review.js";
import ExpressError from "./utils/ExpressError.js";
import listingSchema from "./schema.js";
import   {reviewSchema} from "./schema.js";


function isLoggedIn(req, res, next) {
  
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must log in first");
    return res.redirect('/login');   // <- important: return!
  }
  next();
}

function saveRedirectUrl(req,res,next){
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next();
}
async function isOwner(req,res, next){
  let {id} = req.params;
 
  
  
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You are not owner of this Listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

//a middleware that uses your Joi listingSchema to validate incoming request data before it hits your main route logic 
const validateListing = (req,res,next) =>{
    let {value, error} = listingSchema.validate(req.body);
    if(error){
      let errorMsg = error.details.map((el) =>  el.message).join(",");
      throw new ExpressError(400, errorMsg);
    } else {
      next();
    }
}

const validateReview = (req,res,next) =>{
    let {value, error} = reviewSchema.validate(req.body);
    if(error){
      let errorMsg = error.details.map((el) =>  el.message).join(",");
      throw new ExpressError(400, errorMsg);
    } else {
      next();
    }
}

async function isReviewAuthor(req,res, next){
  let {id, reviewId} = req.params;
 
  
  
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You are not author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
export { isLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview, isReviewAuthor};
