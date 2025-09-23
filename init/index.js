import mongoose from "mongoose";
import sampleListings from "./sampleData.js";
import Listing from "../Models/Listings.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";



async function main(){
  await mongoose.connect(MONGO_URL);
  console.log("connected to DB")
  await initDB();
}
main().then(() =>{console.log('connected to DB')})
.catch(err =>{console.log(err)});

const initDB = async () =>{
  await Listing.deleteMany({});
  let listingsWithOwner = sampleListings.map(obj => ({ ...obj, owner: "68bc3869730757e7a4cd8fcd" }));

  await Listing.insertMany(listingsWithOwner);
  console.log("data initializedd")
}

