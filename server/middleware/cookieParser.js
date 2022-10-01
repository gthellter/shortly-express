const parseCookies = (req, res, next) => {
  var cookie = req.headers.cookie;
  if (cookie !== undefined && cookie !== {} && cookie !== null) {
    cookie = cookie.split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
    req.cookies = cookie;
    next();
  } else {
    res.sendStatus(401);
  }
};

module.exports = parseCookies;


// Get each individual key-value pair from the cookie string using string.split(“;”).

// Separate keys from values in each pair using string.split(“=”).

// Create an object with all key-value pairs and return the object.