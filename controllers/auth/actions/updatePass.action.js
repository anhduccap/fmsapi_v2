const { validationResult } = require('express-validator');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const helper = require('../../../helpers/index');
const accountModel = require('../../../models/account.model');

module.exports = async function (req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        let code = 400;
        return res
            .status(code)
            .send( helper.responseFailure(false, code, 'Invalid input', errors.array()) );
    }
    try {
        const payload = req.body;
        
        if(payload.new_password !== payload.repeat_new_password) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, code, res.__('update_pass_failed')) );
        }

        const accountInfo = await accountModel.findOne({id: req.accountID});
        if(_.get(accountInfo, 'id', null) === null) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, code, res.__('update_pass_failed')) );
        }

        if(!await bcrypt.compare(payload.old_password, accountInfo.password)) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, code, res.__('update_pass_failed')) );
        }

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND,10));
        const hashedPassword = await bcrypt.hash(payload.new_password, salt);

        const updatedPassword = await accountModel.updateMany({id: accountInfo.account}, {password: hashedPassword});
        if(updatedPassword.modifiedCount !== updatedPassword.matchedCount) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, 400, res.__('update_pass_failed')));
        }

        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, res.__('update_pass_success')));
    } catch (err) {
        console.log(err);
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
};
