import User from "../Models/User.js";

const renderSignupForm = (req,res)=>{
  res.render('./users/signup');
}

const signup = async (req,res) => {
  try{
    const {username, email, password} = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, function(err){
      if(err) return err;
      req.flash("success", "Welcome to wanderlust");
      res.redirect('/listings');
    })
    
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