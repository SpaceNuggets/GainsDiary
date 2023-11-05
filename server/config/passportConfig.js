const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const uri = process.env.URI;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const client = new MongoClient(uri);
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');
        const user = await users.findOne({ login: username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: 'Invalid login or password.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);