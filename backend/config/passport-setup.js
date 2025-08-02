    const passport = require('passport');
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    const User = require('../models/User');

    passport.use(
      new GoogleStrategy(
        {
          // Options for the Google strategy
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          // This function is called when a user successfully authenticates with Google
          try {
            // Check if user already exists in our DB
            let existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
              // If they exist, we're done
              return done(null, existingUser);
            }

            // If not, check if they exist by email
            existingUser = await User.findOne({ email: profile.emails[0].value });
            if (existingUser) {
                // If they exist by email, link their googleId
                existingUser.googleId = profile.id;
                await existingUser.save();
                return done(null, existingUser);
            }


            // If they don't exist at all, create a new user
            const newUser = await new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              // No password needed for Google OAuth
            }).save();
            done(null, newUser);
          } catch (error) {
            done(error, false);
          }
        }
      )
    );

    // These are not strictly necessary for JWT-based auth but are good practice for Passport
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
    