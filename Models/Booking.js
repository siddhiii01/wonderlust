import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = Schema({
  listingId:
    {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    }
  ,
  checkin: {
    type: Date,
    required: true
  }
  ,
  checkout: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },

  //user who booked so we know who made the payment
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "failed", "paid"],
    default: "pending"
  },

  stripeSessionId: {
    type: String
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;

