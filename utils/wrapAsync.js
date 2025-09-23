const wrapAsync = (fn) => (req,res,next) =>{
  fn(req,res,next).catch(next);
};

export default wrapAsync;

// const wrapAsync = (fn) => ...
// You're defining a higher-order function — it takes a function fn (typically an async function for a route) and returns a new function.
// That new function will be Express-compatible: (req, res, next).

// 2. (req, res, next) => { fn(req, res, next).catch(next); }
// This returned function is meant to wrap your async route handler.
// Normally in Express:
// app.get('/route', async (req, res) => { ... })
// If that async function throws an error, it won't be caught unless you use a try...catch, or this wrapper.
// fn(req, res, next) is called — since fn is an async function, it returns a Promise.
// If that Promise rejects (i.e., an error occurs), .catch(next) forwards the error to Express’s error middleware.