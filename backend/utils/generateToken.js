// backend/utils/generateToken.js
const jwt = require("jsonwebtoken");

// Function to generate token programmatically in your app
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // token valid for 30 days
  });
};

// Standalone script mode: run `node backend/utils/generateToken.js`
if (require.main === module) {
  const userId = "68aca46083852b25ded70e99"; // replace with your real user ID
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "supersecretchangeme",
    { expiresIn: "30d" }
  );
  console.log("\nYour new JWT token:\n");
  console.log(token);
}

module.exports = generateToken;
