import Listing from "../Models/Listings.js";
import Booking from "../Models/Booking.js";
import Stripe from "stripe";
// import { geocoding } from "@maptiler/client";
import dotenv from "dotenv";
dotenv.config();
// import { geocoding } from "@maptiler/client";
import geocoding from "../utils/mapTiler.js";


const stripe = Stripe(process.env.STRIPE_SECRET_KEY) 

const index = async (req, res) =>{
  let {search_destination} = req.query;
  console.log(search_destination);

  let allListing;
  if(search_destination){
    allListing = await Listing.find({country: {$regex: search_destination, $options: "i"}});
  }
  else {
    allListing= await Listing.find({});
  }
  res.render("./listings/index.ejs", {allListing});
}

const renderNewForm = (req, res) =>{
  res.render("./listings/new.ejs");
}

const showListings = async(req, res) =>{
  const {id} = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
  //console.log(listing);
  
  //disabling dates
  const bookedListingDate = await Booking.find({listingId: id});
  const disabledDate = bookedListingDate.map(function(b){
    return {
      from: b.checkin.toISOString().split("T")[0],
      to: b.checkout.toISOString().split("T")[0]
    }
  });
  res.render("./listings/show.ejs", {
    listing,
    disabledDate,
     mapApi: process.env.MAP_API_KEY   // <-- pass the API key to EJS
  });
}


// const createListing = async (req, res) => {
//   let url = req.file.path;
//   let fileName = req.file.filename;

//   let newListing = req.body.listing; // Extract listing object
//   let listingDoc = new Listing(newListing); // Create Mongoose doc
//   listingDoc.owner = req.user._id;
//   listingDoc.image = { url, fileName };

//   try {
//     // Use the correct key for location
//     const location = newListing.location;

//     const response = await geocoding.forward(location, { limit: 1 });

//     if (!response || !response.features || response.features.length === 0) {
//       throw new Error("No geocoding result found");
//     }

//     // Assign coordinates to the same object
//     const coordinates = response.features[0].geometry.coordinates;
//     listingDoc.geometry = {
//       type: "Point",
//       coordinates: coordinates,
//     };

//     await listingDoc.save(); // Save to DB

//     req.flash("success", "Listing created successfully");
//     res.redirect("/listings");
//   } catch (error) {
//     console.error("Geocoding failed:", error.message);
//     req.flash("error", "Could not create listing. Please try again.");
//     res.redirect("/listings");
//   }
// };
const createListing = async (req, res) => {
  let url = req.file.path;
  let fileName = req.file.filename;

  let newListing = req.body.listing; // Extract listing object
  let listingDoc = new Listing(newListing); // Create Mongoose doc
  listingDoc.owner = req.user._id;
  listingDoc.image = { url, fileName };

  try {
    // Combine city + country for accurate geocoding
    const locationQuery = `${newListing.location}, ${newListing.country}`;

    const response = await geocoding.forward(locationQuery, { limit: 1 });

    if (!response || !response.features || response.features.length === 0) {
      throw new Error("No geocoding result found");
    }

    // Assign coordinates to the same object
    const coordinates = response.features[0].geometry.coordinates;
    listingDoc.geometry = {
      type: "Point",
      coordinates: coordinates,
    };

    await listingDoc.save(); // Save to DB

    req.flash("success", "Listing created successfully");
    res.redirect("/listings");
  } catch (error) {
    console.error("Geocoding failed:", error.message);
    req.flash("error", "Could not create listing. Please try again.");
    res.redirect("/listings");
  }
};



const renderEditForm = async (req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);

  

  let originalImageUrl = listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_250")
  res.render('./listings/edit.ejs', {
    listing,
    originalImageUrl,
    mapApi: process.env.MAP_API_KEY  // <-- pass the API key to EJS
  });
}

const updateListing = async(req,res)=>{
  const { id } = req.params;
  
  const listingData = req.body.listing;
  const listing = await Listing.findByIdAndUpdate(id, listingData);

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let fileName = req.file.filename;
    listing.image = {url, fileName};
    await listing.save();
  }
  res.redirect(`/listings/${id}`);
}

const destroyListing = async(req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}

const showBooking = async (req, res) => {
  let { id } = req.params;
  let { check_in, check_out } = req.query;

  const inDate = new Date(check_in);
  const outDate = new Date(check_out);

  // Find listing and populate owner in one go
  let listing = await Listing.findById(id).populate("owner");

  if (!listing) {
    return res.status(404).send("Listing not found");
  }

  // Optional: booking creation (test object, not saving)
  let newBooking = new Booking({
    checkin: inDate,
    checkout: outDate,
    listingId: id
  });

  res.render("./listings/bookings.ejs", {
    check_in: inDate,
    check_out: outDate,
    listing,            // contains owner populated
    owner: listing.owner
  });
};


const makePayment = async(req, res) =>{
  const {id} = req.params;
  const {check_in, check_out} = req.body;
  const currUser = res.locals.currUser;
  
  console.log("payment: ",id, check_in, check_out, res.locals.currUser);

  //always fetch price from listing Db -> that is the true and original price
  const listing = await Listing.findById(id);
  if(!listing){
    return req.flash("error", "Listing Doesn't exist");
  }

  //now calculating price with number of nights
  const nights = Math.ceil((new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24));
  const totalPrice = listing.price *  nights;


  //make payment through stripe
  const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",
  line_items: [{
    price_data: {
      currency: "inr",
      product_data: { name: listing.title },
      unit_amount: totalPrice * 100,
    },
    quantity: 1,
  }],
    
    success_url: `${process.env.DOMAIN}/${id}/success/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}/${id}/cancel`,

  
});

  res.redirect(session.url);

  //creating a booking with status pending
  const newBooking = new Booking({
    listingId: id,
    user: currUser.id,
    checkin: check_in, 
    checkout: check_out,
    totalPrice,
    stripeSessionId: session.id
  });

  await newBooking.save();
}



const showSuccessPayment = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    req.flash("error", "Payment was not successful");
    return res.redirect("/listings");
  }

  try {
    // Fetch session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      req.flash("error", "Stripe session not found");
      return res.redirect("/listings");
    }

    // Find the booking in DB using stripeSessionId
    const booking = await Booking.findOne({ stripeSessionId: session_id });

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
    }

    // Update payment status
    if (session.payment_status === "paid") {
      booking.paymentStatus = "paid";
      await booking.save();

      req.flash("success", "Payment successful! Booking confirmed");
    } else {
      req.flash("error", "Payment not completed.");
    }

    return res.redirect("/listings");
  } catch (err) {
    console.error("Stripe or DB error:", err);
    req.flash("error", "Something went wrong with the payment.");
    return res.redirect("/listings");
  }
};



export default {index, renderNewForm, showListings, createListing, renderEditForm, updateListing, destroyListing, showBooking, makePayment, showSuccessPayment}