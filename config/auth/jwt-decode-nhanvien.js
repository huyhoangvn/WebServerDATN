const passport = require('passport')
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const { JWT_SECRET } = require('./secret')
const User = require('../../model/NhanVien')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('Authorization');
opts.secretOrKey = JWT_SECRET;
opts.issuer = 'WebServerDATN';

passport.use(new JwtStrategy(opts, async function(payload, done) {
    try {
        const user = await User.model.find({ _id: payload.sub })
        if (!user[0]) return done(null, false)
        console.log("Config")
        return done(null, user)
    } catch (error) {
        done(error, false)
    }
}));
