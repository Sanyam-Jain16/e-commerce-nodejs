const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d", // short-lived
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d", // long-lived
  });
};

module.exports = { generateAccessToken, generateRefreshToken };

// The JWT secret is a private key used to sign and verify JSON Web Tokens (JWT). It ensures the integrity and authenticity of the token. Without it, tokens can’t be trusted.

// 🔐 Why It Matters:
// When generating a JWT, the secret is used to encrypt the payload.
// When verifying a JWT, the same secret is used to validate that the token is untampered.
