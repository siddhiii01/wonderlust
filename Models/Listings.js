import mongoose from "mongoose";
import Review from "./Review.js";
const Schema = mongoose.Schema;


const listingSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    fileName: String
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },

  //now here we want every listing to have review 
  //one listing can have multiple review so we will use array 
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

listingSchema.post('findOneAndDelete', async(listing) =>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema)
export default Listing;