const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User'); 

passport.use(
    new LocalStrategy(
        { usernameField: 'name' }, 
        async (name, password, done) => {
            try {
                const user = await User.findOne({ name }); 
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                const isPasswordMatched = await user.comparePassword(password);  
                if (isPasswordMatched) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

const safe = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err); 
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized', info });
        }
        req.user = user;
        next();
    })(req, res, next); 
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Your request is invalid' }); 
  }
  next();
};

module.exports = { passport, safe, authorize };