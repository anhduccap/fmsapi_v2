const bcrypt = require('bcrypt');
const md5 = require('md5');
const _ = require('lodash');
const redis = require('redis');
const client = redis.createClient(6379);
const nodeMailer = require('nodemailer');

const helper = require('../../../helpers/index');
const accountModel = require('../../../models/account.model');

module.exports = async function(req, res) {
    try {
        const resetToken = req.query.token;
        console.log(resetToken)

        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();

        let resetTokenInfo = await client.get(`resetpass_token_${req.publicIP}`);
        resetTokenInfo = JSON.parse(resetTokenInfo);
        await client.quit();

        if(!resetTokenInfo) return res.send(`<body><p>${res.__('link_not_found')}</p><script>setTimeout(function(){window.close()}, 5000);</script ></body>`);

        if(md5(JSON.stringify(resetTokenInfo)) !== resetToken) return res.send(`<body><p>${res.__('link_not_found')}</p><script>setTimeout(function(){window.close()}, 5000);</script ></body>`);

        if(resetTokenInfo.expiredAt < Date.now()) return res.send(`<body><p>${res.__('link_expired')}</p><script>setTimeout(function(){window.close()}, 5000);</script ></body>`);

        const newPassword = helper.generatePassword(8);
        // const newPassword = '12345678';
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND,10));
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedPassword = await accountModel.updateMany({id: resetTokenInfo.account}, {password: hashedPassword});

        if(updatedPassword.modifiedCount !== updatedPassword.matchedCount) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, 400, res.__('reset_pass_failed')));
        }

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
            subject: '[FMS] New password was be delivered to your email',
            html: `<p><b>New password</b>: ${newPassword}</p>`,
        };

        await transport.sendMail(options);
        
        return res.send(`<body><p>${res.__('reset_pass_success')}</p><script>setTimeout(function(){window.close()}, 5000);</script ></body>`);
    } catch(err) {
        console.log(err);
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
};
