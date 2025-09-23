if (process.env.NODE_ENV !== "production") {
  // load dotenv only in dev
  await import("dotenv/config");
}


import express from "express";
import mongoose from "mongoose";
// import Listing from "./Models/Listings.js";
// import Review from "./Models/Review.js";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from 'method-override';
import ejsMate from "ejs-mate";
// import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
// import listingSchema, { reviewSchema } from "./schema.js";
import listingRouter from './routes/listings.js'
import reviewsRouter from './routes/review.js'
import flatpickr from "flatpickr";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local"
import User from "./Models/User.js";
import userRouter from "./routes/user.js"

// import Stripe from "stripe";


const app = express();
const PORT = 8000;
app.listen(PORT);

//const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL

// Fix for __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

// Static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

//to parse JSON data use
app.use(express.json())

//to parse form data use
app.use(express.urlencoded({ extended: true }));

//middleware to form access put req
app.use(methodOverride('_method'));

// We're hooking .ejs files to use ejs-mate’s enhanced rendering, not just plain EJS.
// Features like layouts, partials, and blocks are now enabled.
app.engine('ejs', ejsMate);

//using static public folder
app.use(express.static('public'));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
});

store.on("error", () =>{
  console.log("ERORR in MONGO SESSION STORE", err)
})

//session object
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 1000 * 60, // exact expiry date
    maxAge: 7 * 24 * 60 * 1000 * 60,               // 3 days in ms
    httpOnly: true, //prevents JS -> document.cookie access , XXS acttack
  }
};

app.use(session(sessionOptions));


//use flash after session becoz flash are stored in session not in DB

app.use(flash());


//On each request, Passport needs to run:
app.use(passport.initialize());
app.use(passport.session());

//CPassport requires a strategy = how to authenticate.
passport.use(new LocalStrategy(User.authenticate()));

//passport-local-mongoose gives built-in static methods:
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
  // console.log("locals")
 // then they are moved to res.locals and automactically deleted onced they are deleted
 res.locals.success = req.flash("success"); // passed it to ejs w-out manually rendering it
 res.locals.error = req.flash("error");
 res.locals.currUser = req.user;
 //console.log(res.locals.success)
 next();
});


app.get('/', (req,res) =>{
  res.send("Root Page");
});






//express router
app.use('/listings', listingRouter); 
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter)



main().then(() =>{console.log('connected to DB')})
.catch(err =>{console.log(err)});

async function main(){
  await mongoose.connect(dbUrl);
}





//Flight Section
app.get('/flights', (req,res) =>{
  res.render('./flights/index.ejs')
})


// This route acts as a "catch-all" for any HTTP method (GET, POST, etc.)
// and any URL path that was not matched by the routes defined above.
// If no other route matches, Express reaches here.
// We create a new ExpressError object with a 404 status code and message.
// Calling next(err) tells Express to skip any remaining middleware
// and pass the error directly to the error-handling middleware.
app.all("/{*splat}", (req,res, next)=>{
  next(new ExpressError(404, "Page not found"));
});


app.use((err, req, res, next) => {
  console.error("RAW ERROR OBJECT:", err);
  console.error("INSTANCE OF ExpressError?", err instanceof ExpressError);
  let { statusCode = 500, message = "Something went wrong" } = err; 
  res.status(statusCode).render("error.ejs", {message});
});

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// })