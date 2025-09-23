import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import User from "../Models/User.js";
import passport from "passport";
import {saveRedirectUrl} from "../middleware.js"
import userController from "../controllers/user.js"
const router = express.Router();

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup ))

//login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
  saveRedirectUrl,
  passport.authenticate('local',
    { failureRedirect: '/login', failureFlash: true }
  ), userController.loginUser);

router.get('/logout',userController.logoutUser );

export default router;
