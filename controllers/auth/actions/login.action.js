const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const moment = require('moment');
const _ = require('lodash');

const helper = require('../../../helpers/index');
const accountModel = require('../../../models/account.model');
const tokenModel = require('../../../models/token.model');

module.exports = async function (req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        let code = 400;
        return res
            .status(code)
            .send( helper.responseFailure(false, code, 'Invalid input', errors.array()) );
    }
    try{
        const account = await accountModel.findOne({username: req.body.username});
        if(!account) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, 400, res.__('login_incorrect'), null) );
        }

        const passwordValidation = await bcrypt.compare(req.body.password, account.password);
        if(!passwordValidation) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, 400, res.__('login_incorrect'), null) );
        }

        const token = jwt.sign({
            accountID: account.id,
        }, process.env.JWT_SECRET_KEY);

        const hashValidate = md5(req.publicIP + token);

        const deactiveOldToken = await tokenModel.updateMany({account: account.id}, {status: 'DEACTIVE'});
        if(deactiveOldToken.modifiedCount !== deactiveOldToken.matchedCount) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, 400, res.__('login_failed'), null) );
        }

        const newToken = new tokenModel({
            hashValidate: hashValidate,
            account: account.id,
            expiredAt: moment(new Date()).add(1, 'hours'),
            status: 'ACTIVE',
        });

        const genToken = await newToken.save();
        if(_.get(genToken, '_id', null) === null) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, 400, res.__('login_failed'), null) );
        }

        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, res.__('login_success'), {token: token}));
    }
    catch(err){
        console.log(err);
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
};
