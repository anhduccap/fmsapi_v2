const { validationResult } = require('express-validator');
const md5 = require('md5');
const _ = require('lodash');
const redis = require('redis');
const client = redis.createClient(6379);
const nodeMailer = require('nodemailer');

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
        console.log(req.publicIP)
        // Check spam
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();

        let resetTokenInfo = await client.get(`resetpass_token_${req.publicIP}`);
        resetTokenInfo = JSON.parse(resetTokenInfo);

        if(resetTokenInfo) {
            if(Math.floor((Date.now() - new Date(resetTokenInfo.createdAt)) / 60000) <= 3) {
                let code = 400;
                return res.status(code).send( helper.responseFailure(false, code, `${res.__('try_again')} ${3-Math.floor((Date.now() - new Date(resetTokenInfo.createdAt)) / 60000)} ${res.__('min')}!`) );
            }
        }

        const account = await accountModel.findOne({username: req.body.username});
        if(_.get(account, 'id', null) === null) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, res.__('account_not_found')));
        }

        const resetTokenObj = {
            account: account.id,
            expiredAt: Date.now() + 60000,
            createdAt: Date.now(),
        }

        const hashedCode = md5(JSON.stringify(resetTokenObj));

        await client.set(`resetpass_token_${req.publicIP}`, JSON.stringify(resetTokenObj), 180);
        await client.quit();

        const transport = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const options = {
            from: `"ManUtd Official" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: 'anhduccap@gmail.com',
            subject: '[FMS] Reset password',
            html: `<a href="${process.env.APP_URL}/auth/account/reset_password?token=${hashedCode}"> Reset link </a>`,
        };

        await transport.sendMail(options);

        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, res.__('forget_pass_success')));
    } catch (err) {
        console.log(err);
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
};
