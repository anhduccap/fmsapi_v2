const bcrypt = require('bcrypt');
const _ = require('lodash');

const helper = require('../../../helpers/index');
const accountModel = require('../../../models/account.model');
const detailInfoModel = require('../../../models/detail.model');

module.exports = async (req, res) => {
    try{
        const payload = req.body;

        const accountByUsername = await accountModel.findOne({username: payload.username});
        const accountByPhone = await accountModel.findOne({phone: payload.phone});

        if(_.get(accountByPhone, 'id', null) !== null || _.get(accountByUsername, 'id', null) !== null) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, res.__('account_existed')));
        }

        // Create detail info
        let newDetailInfo = null;
        if(payload.globalID !== null && payload.type === 'PLAYER') {
            try {
                newDetailInfo = new detailInfoModel({
                    globalID: payload.globalID
                });
                await newDetailInfo.save();
            } catch (err) {
                console.log('DEBUG ::: Create detail info error');
                throw err;
            }
        }

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUND,10));
        const hashedPassword = await bcrypt.hash(payload.password, salt);

        const dob = new Date(payload.dob).getTime();
        const now = new Date().getTime();
        const gap = new Date(now-dob);
        const age = gap.getUTCFullYear() - 1970;

        const accountObj = {
            name: payload.name,
            firstName: payload.firstName,
            lastName: payload.lastName,
            gender: payload.gender,
            phone: payload.phone,
            email: payload.email,
            username: payload.username,
            password: hashedPassword,
            photo: payload.photo,
            age: age,
            dob: payload.dob,
            nationality: payload.nationality,
            type: payload.type,
            detailInfo: (newDetailInfo !== null) ? newDetailInfo.id : null,
        };

        const newAccount = new accountModel(accountObj);
        const createdAccout = await newAccount.save();
        
        if(_.get(createdAccout, 'id', null) === null) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, res.__('register_failed')));
        }

        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, res.__('register_success')));
    } catch(err){
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
}