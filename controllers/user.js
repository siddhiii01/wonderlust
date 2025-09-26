import User from "../Models/User.js";

const renderSignupForm = (req,res)=>{
  res.render('./users/signup');
}

const signup = async (req,res) => {
  try{
    const {username, email, password} = req.body;

     // Server-side: check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      req.flash("error", "Username or email already exists. Please choose another.");
      return res.redirect("/signup"); // redirect back to signup form
    }
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    //console.log(registeredUser);

     // Auto-login after signup
    req.login(registeredUser, function(err) {
      if (err) {
        req.flash("error", "Something went wrong during login.");
        return res.redirect("/signup");
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
    
  } catch(e){
    console.log(e);
    req.flash('error', e.message);
  }
}

const renderLoginForm = (req,res) =>{
  res.render('./users/login', {showSearch: false});
}

const loginUser = async(req,res) =>{
    req.flash('success', "Welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}

const logoutUser = (req,res,next) =>{
  req.logout(function(err){
    if(err) return err;
    req.flash("success", "you're logged out");
    res.redirect('/listings');
  })
}

export default {signup, renderSignupForm, renderLoginForm, loginUser, logoutUser};