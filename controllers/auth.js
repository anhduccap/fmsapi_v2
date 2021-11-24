const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const helper = require('../helpers/index');
const MemberModel = require('../models/member');

let generatePassword = (length) => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
    let pass = "";
    for (let x = 0; x < length; x++) {
        let i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

let generateUsername = (name, id) => {
    name = name.toLowerCase();
    name = helper.removeVietnameseTones(name);
    name = name.split(' ');
    let username = name.map(element => element[0])

    return username.join('') + id.toString();
}

exports.register = async (req, res, next) => {
    if(req.role === 1) {
        let username = generateUsername(req.body.name, req.body.id);
    
        try{
            let member = await MemberModel.findOne({id: req.body.id});
            if(!member) {
                // let password = generatePassword(12);
                let password = '12345'
                let salt = await bcrypt.genSalt(10);
                password = await bcrypt.hash(password, salt);

                const Member = new MemberModel({
                    id: req.body.id,
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    role: req.body.role,
                    username: username,
                    password: password,
                    photo: req.body.photo,
                });
                
                Member.save((err) => {
                    if(err) {
                        let code = 500;
                        return res.status(code).send(helper.responseFailure(false, code, err.message));
                    }
                    let code = 200;
                    return res.status(code).send(helper.responseSuccess(true, code, 'Success creation'));
                });
            }
            else {
                let code = 400;
                return res.status(code).send(helper.responseFailure(false, code, 'This account was existed'));
            }
        }
        catch(err){
            let code = 500;
            return res.status(code).send( helper.responseFailure(false, code, err.message) );
        }
    }
    else{
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, 'Access denied. No permission'));
    }
}

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        let code = 400;
        return res
            .status(code)
            .send( helper.responseFailure(false, code, 'Invalid input', errors.array()) );
    }

    try{
        const member = await MemberModel.findOne({username: req.body.username});
        if(!member) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, code, 'Username or Password is incorrect') );
        }
        
        let passwordValidation = await bcrypt.compare(req.body.password, member.password);
        if(!passwordValidation) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, code, 'Username or Password is incorrect') );
        }
        let token = jwt.sign({
            data: {
                member_id: member._id,
                role: member.role,
            },
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
        }, process.env.JWT_SECRET_KEY);

        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, 'Login success', {token: token}));
    }
    catch(err){
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
}

exports.updatePhone = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let code = 400;
        return res
            .status(code)
            .send( helper.responseFailure(false, code, 'Invalid input', errors.array()) );
    }
    else{
        let newPhone = helper.standardizePhoneNumber(req.body.phone);
        if(req.member_id !== req.params.member_id) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, code, 'Access denied') );
        }

        try{
            let member = await MemberModel.findOne({_id: req.member_id});
            if(!member.phone || (member.phone.toString() !== newPhone.toString() && member.phone)) {
                MemberModel.findByIdAndUpdate(req.member_id, {phone: newPhone, date_edited: Date.now()})
                    .then(newInformation => newInformation.save())
                    .then(result => {
                        let code = 200;
                        return res.status(code).send(helper.responseSuccess(true, code, 'Update success'));
                    })
                    .catch(err => {
                        let code = 500;
                        return res.status(code).send(helper.responseFailure(false, code, err.message));
                    });
            }
            else{
                let code = 400;
                return res.status(code).send(helper.responseFailure(false, code, 'Not modified'));
            }
        }
        catch(err) {
            let code = 500;
            return res.status(code).send( helper.responseFailure(false, code, err.message) );
        }
    }
}

exports.updateEmail = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let code = 400;
        return res
            .status(code)
            .send( helper.responseFailure(false, code, 'Invalid input', errors.array()) );
    }
    else{
        if(req.member_id !== req.params.member_id) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, code, 'Access denied') );
        }

        try{
            let member = await MemberModel.findOne({_id: req.member_id});
            if(!member.email || (member.email.toString() !== req.body.email.toString() && member.email)) {
                MemberModel.findByIdAndUpdate(req.member_id, {email: req.body.email, date_edited: Date.now()})
                    .then(newInformation => newInformation.save())
                    .then(result => {
                        let code = 200;
                        return res.status(code).send(helper.responseSuccess(true, code, 'Update success'));
                    })
                    .catch(err => {
                        let code = 500;
                        return res.status(code).send(helper.responseFailure(false, code, err.message));
                    });
            }
            else{
                let code = 400;
                return res.status(code).send(helper.responseFailure(false, code, 'Not modified'));
            }
        }
        catch(err) {
            let code = 500;
            return res.status(code).send( helper.responseFailure(false, code, err.message) );
        }
    }
}

exports.updatePassword = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let code = 400;
        return res
            .status(code)
            .send( helper.responseFailure(false, code, 'Invalid input', errors.array()) );
    }
    else{
        if(req.member_id !== req.params.member_id) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, code, 'Access denied') );
        }
        if(req.body.new_password !== req.body.repeat_new_password) {
            let code = 400;
            return res.status(code).send( helper.responseFailure(false, code, 'Repeat password incorrect') );
        }
        try {
            let member = await MemberModel.findById(req.member_id);
            let passwordValidation = await bcrypt.compare(req.body.old_password, member.password);
            if(!passwordValidation) {
                let code = 400;
                return res.status(code).send( helper.responseFailure(false, code, 'Old password is incorrect') );
            }
            let salt = await bcrypt.genSalt(10);
            let newPassword = await bcrypt.hash(req.body.new_password, salt);
            MemberModel.findByIdAndUpdate(req.member_id, {password: newPassword, date_edited: Date.now()})
                .then(newInformation => newInformation.save())
                .then(result => {
                    let code = 200;
                    return res.status(code).send(helper.responseSuccess(true, code, 'Update success'));
                })
                .catch(err => {
                    let code = 500;
                    return res.status(code).send(helper.responseFailure(false, code, err.message));
                });
        }
        catch(err) {
            let code = 500;
            return res.status(code).send( helper.responseFailure(false, code, err.message) );
        }
    }
}

exports.resetPassword = async (req, res) => {
    if(req.role !== 1) {
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, 'Access denied'));
    }

    try{
        let newPassword = generatePassword(10);
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(newPassword, salt);
        MemberModel.findByIdAndUpdate(req.params.member_id, { password: hashedPassword, date_edited: Date.now()})
            .then(newInformation => newInformation.save())
            .then(result => {
                let code = 200;
                return res.status(code).send(helper.responseSuccess(true, code, 'Reset success', {new_password: newPassword}));
            })
            .catch(err => {
                let code = 500;
                return res.status(code).send(helper.responseFailure(false, code, err.message));
            });
    }
    catch(err){
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
}
