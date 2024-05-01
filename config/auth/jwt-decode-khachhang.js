const passport = require('passport')
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const { JWT_SECRET } = require('./secret')
const User = require('../../model/KhachHang')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('Authorization');
opts.secretOrKey = JWT_SECRET;
opts.issuer = 'WebServerDATN';
passport.use("khachhang-jwt",new JwtStrategy(opts, async function(payload, done) {
    try {
        const user = await User.model.findOne({ _id: payload.sub });
        if (!user) return done(null, false)

        return done(null, true)
    } catch (error) {
        done(error, false)
    }
}));
