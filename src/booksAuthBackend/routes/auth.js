const express = require("express");
const { add, get, updateEmail } = require("../data/user");
const { createJSONToken, isValidPassword } = require("../util/auth");
const { isValidEmail, isValidText } = require("../util/validation");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const data = req.body;
  let errors = {};

  if (!isValidEmail(data.email)) {
    errors.email = "Invalid email.";
  } else {
    try {
      const existingUser = await get(data.email);
      if (existingUser) {
        errors.email = "Email exists already.";
      }
    } catch (error) {}
  }

  if (!isValidText(data.password, 6)) {
    errors.password = "Invalid password. Must be at least 6 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "User signup failed due to validation errors.",
      errors,
    });
  }

  try {
    const createdUser = await add(data);
    const authToken = createJSONToken(createdUser.email);
    res
      .status(201)
      .json({ message: "User created.", user: createdUser, token: authToken });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  try {
   user = await get(email);
  
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed." });
  }

  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    return res.status(422).json({
      message: "Invalid credentials.",
      errors: { credentials: "Invalid email or password entered." },
    });
  }

  const token= createJSONToken(email);
 
  res.json({ token, user: user.role });
});

// You have to provide the authentication token to the headers of the request and also the newEmail to the body.
router.put('/update-email', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }

  const userId = decodedToken.userId;
  const { newEmail } = req.body;

  try {
    const updatedUser = await updateEmail(userId, newEmail);
    res.status(200).json({ message: 'Email updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating email', error });
  }
});

module.exports = router;
