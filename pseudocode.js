// Usernames and passwords
  //add routes to express server to process incoming POST req

  // add appropriate callback functions to routes
  // add methods to your user model - separation of concerns in mind

// Sessions and cookies
  // Write  a cookie parser middleware
    //req.Cookie => session_id=id;
  // Write a session generator middleware.
    //in res.setHeader('set-cookie', 'session_id=id')
  // store generated hashes in the database table "Sessions"

  // In middleware/cookieParser.js, write a middleware function that will access the cookies on an incoming request, parse them into an object, and assign this object to a cookies property on the request.

  // write a createSession middleware function that accesses the parsed cookies on the request, looks up the user data related to that session, and assigns an object to a session property on the request that contains relevant user information.

  // Mount these two middleware functions in app.js so that they are executed for all requests received by your server.

//Authenticated Routes

  // Add a verifySession helper function to all server routes that require login,

 // Give the user a way to log out.