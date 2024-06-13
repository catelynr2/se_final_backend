const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

module.exports = (req, res, next) => {
  // Get the token from the Authorization header
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // If the token is not provided or doesn't start with 'Bearer ', return a 401 error
    return next(new UnauthorizedError("Unauthorized"));
  }

  // Extract the token from the Authorization header
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    // Add the token payload to the user object
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(
      new UnauthorizedError("An error occurred while parsing the payload")
    );
  }

  req.user = payload; // adding the payload to the Request object

  return next(); // passing the request further along
};
