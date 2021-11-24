const jwt = require('jsonwebtoken');

const helper = require('../helpers/index');

exports.checkToken = async (req, res, next) => {
    let token = req.header('auth-token');
    if(!token) {
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, 'Access denied'));
    }
    try{
        let decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.member_id = decoded.data.member_id;
        req.role = decoded.data.role;
        next();
    }
    catch(err) {
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, err.message));
    }
}
