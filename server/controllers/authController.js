const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/userModel');
const passport = require('passport');

async function signup(req, res) {
  const { email, login, password } = req.body;
  const generatedUserID = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const data = {
      user_id: generatedUserID,
      email: email.toLowerCase(),
      password: hashedPassword,
      login: login
    };

    let existingUser = await UserModel.findOne({ email:data.email })

    if (existingUser) {
      return res.status(409).send('Provided email already exists! Log in!')
    }
    existingUser = await UserModel.findOne({ login:data.login })
    if (existingUser) {
      return res.status(409).send('Provided login is already in use')
    }

    const userInserted = await UserModel.create(data);

    const authToken = jwt.sign(userInserted, login, {
      expiresIn: 60 * 24,
    });

    res.status(201).json({ authToken, userID: generatedUserID });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  signup
};