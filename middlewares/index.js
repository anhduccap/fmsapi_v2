const jwt = require('jsonwebtoken');
const axios = require('axios');
const _ = require('lodash');
const md5 = require('md5');

const helper = require('../helpers/index');
const tokenModel = require('../models/token.model');
const accoutModel = require('../models/account.model');
const accountModel = require('../models/account.model');

exports.checkToken = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, res.__('access_denied')));
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const tokenInfo = await tokenModel.findOne({account: decoded.accountID, status: 'ACTIVE'});

        if(_.get(tokenInfo, 'id', null) === null) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, res.__('token_not_found')));
        }

        const hashValidate = md5(req.publicIP + token);
        if(tokenInfo.hashValidate !== hashValidate) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, res.__('token_invalid')));
        }

        if(tokenInfo.expiredAt <= Date.now()) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, res.__('token_expired')));
        }

        req.accountID = decoded.accountID;

        const accountInfo = await accountModel.findOne({id: decoded.accountID});
        if(accountInfo.type === 'ADMIN') req.isAdmin = true;
        else req.isAdmin = false;

        next();
    }
    catch(err) {
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, err.message));
    }
}

exports.checkIP = async (req, res, next) => {
    const response = await axios('https://checkip.amazonaws.com/');
    const ipAdress = response.data.trim();
    req.publicIP = ipAdress;
    next();
}

exports.checkAdminPermission = async (req, res, next) => {
    if(!req.isAdmin) {
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, res.__('access_denied')));
    }
    next();
}
