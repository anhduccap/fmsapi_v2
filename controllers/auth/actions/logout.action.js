const helper = require('../../../helpers/index');
const tokenModel = require('../../../models/token.model');

module.exports = async function (req, res) {
    try {
        const tokenDeleted = await tokenModel.updateMany({account: req.accountID}, {status: 'DEACTIVE'});
        if(tokenDeleted.modifiedCount !== tokenDeleted.matchedCount) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, 400, res.__('logout_failed')) );
        }

        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, res.__('logout_success')));
    } catch (err) {
        console.log(err);
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
};
