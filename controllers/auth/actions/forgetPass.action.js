const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const redis = require('redis');
const client = redis.createClient(6379);

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
        const account = await accountModel.findOne({id: req.accountID});
        if(_.get(account, 'id', null) === null) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, res.__('account_not_found')));
        }

        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();

        let codeInfo = await client.get(`code_${account.id}`);
        codeInfo = JSON.parse(codeInfo);

        if(codeInfo) {
            if(Math.floor((Date.now() - new Date(codeInfo.createdAt)) / 60000) <= 3) {
                let code = 400;
                return res.status(code).send( helper.responseFailure(false, code, `${res.__('try_again')} ${3-Math.floor((Date.now() - new Date(codeInfo.createdAt)) / 60000)} ${res.__('min')}!`) );
            }
        }

        const explainedCode = Math.floor(1000 + Math.random() * 9000);
        console.log('\n_____ CODE: ' + explainedCode + ' _____\n');

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND,10));
        const hashedCode = await bcrypt.hash(String(explainedCode), salt);

        const codeObj = {
            accountID: account.id,
            code: hashedCode,
            expiredAt: Date.now() + 60000,
            createdAt: Date.now(),
        }
        
        await client.set(`code_${account.id}`, JSON.stringify(codeObj), 180);
        await client.disconnect();

        let code = 200;
        return res.status(code).send(helper.responseSuccess(false, code, res.__('forget_pass_success')));
    } catch (err) {
        console.log(err);
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
};
