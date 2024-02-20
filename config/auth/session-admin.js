const setTokenHeader = async(req, res, next)=>{
    try {
        req.headers['authorization'] = "Bearer " + req.session.token
        next();
    } catch (error) {
        next();
    }
}

module.exports = {
    setTokenHeader
}