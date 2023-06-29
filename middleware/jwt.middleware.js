const { expressjwt: jwt } = require('express-jwt');

//instantiate the jwt token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload', // we'll access the decoded jwt req.payload
  getToken: getTokenFromHeaders //the function to extract the jwt
});

function getTokenFromHeaders(req) {
  //check if the token is on the request headers
  //has the following format:
  //const headers: {
  // headers:{
  //    authorization: 'Bearer klnasdklvnkjsdfnvjksdfbv'
  //  }
  //}

  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const token = req.headers.authorization.split(' ')[1];
    return token;
  }
  return null;
}
//export the middleware to use it in protected routes
module.exports = { isAuthenticated };
