class ExpressError extends Error{
  constructor(statusCode,message){
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

export default ExpressError;

// Custom class called ExpressError => also a derived class since it's inheriting Eror class(which has stacktrace, message properties)
// we defined constructuor in that -> We define a constructor so that we can add extra    properties like statusCode
  // we have super() method -> this is mandortary since it is derived class
  // ExpressError has it's own properties like:-
  // statusCode :- any HTTP code 200, 300, 400, 500
  //  message :- any custom message that we want to send
  // this ->  refers to the current instance being created.

//workflow:-
// Workflow
// Somewhere in your route handler, you throw or pass an error:
// next(new ExpressError(404, "Page not found"));
// Express sees this error object and skips normal route handling.
// The error object is passed into error-handling middleware (functions with err, req, res, next as parameters).
// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).send(err.message || "Something went wrong");
// });
// The statusCode and message come from your ExpressError instance.


