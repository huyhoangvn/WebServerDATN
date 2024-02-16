// npm install jsonwebtoken
const JWT = require('jsonwebtoken')
const { JWT_SECRET } = require('./secret')

const encodedToken = (userID) => {
    return JWT.sign({
        iss: "WebServerDATN",
        sub: userID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET)
}

module.exports = {
    encodedToken
}