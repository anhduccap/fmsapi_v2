

const helper = require('../helpers/index');
const MemberModel = require('../models/member');

exports.index = async (req, res, next) => {
    try{

    }
    catch(err) {
        
    }
    return res.send('Home');
}

exports.getBasicInformation = async (req, res) => {
    try {
        let member = await MemberModel.findById(req.member_id);
        let data = {
            name: member.name,
            avatar: member.photo,
        }
        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, 'Sucess', data));
    }
    catch(err){
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
}
