exports.login = require('./actions/login.action');
exports.forgetPassword = require('./actions/forgetPass.action');
exports.resetPassword = require('./actions/resetPass.action');
exports.updatePassword = require('./actions/updatePass.action');
exports.logout = require('./actions/logout.action');

// exports.register = async (req, res) => {
//     try{
//         let salt = await bcrypt.genSalt(10);
//         password = await bcrypt.hash('12345', salt);

//         const newAccount = new accountModel({
//             id: 1,
//             name: 'ADMIN',
//             firstName: '',
//             lastName: '',
//             username: 'admin',
//             password: password,
//             age: 0,
//             type: 'ADMIN',
//         });

//         await newAccount.save();

//         let code = 200;
//         return res.status(code).send(helper.responseSuccess(true, code, res.__('register_success')));


//         // let username = generateUsername(req.body.name, req.body.id);
//         // let member = await MemberModel.findOne({id: req.body.id});
//         // if(!member) {
//         //     // let password = generatePassword(12);
//         //     let password = '12345'
//         //     let salt = await bcrypt.genSalt(10);
//         //     password = await bcrypt.hash(password, salt);
//         //     const Member = new MemberModel({
//         //         id: req.body.id,
//         //         position: req.body.position,
//         //         name: req.body.name,
//         //         role: req.body.role,
//         //         username: username,
//         //         password: password,
//         //         photo: req.body.photo,
//         //     });
            
//         //     Member.save((err) => {
//         //         if(err) {
//         //             let code = 500;
//         //             return res.status(code).send(helper.responseFailure(false, code, err.message));
//         //         }
//         //            let code = 200;
//         //         return res.status(code).send(helper.responseSuccess(true, code, 'Success creation'));
//         //     });
//         // }
//         // else {
//         //     let code = 400;
//         //     return res.status(code).send(helper.responseFailure(false, code, 'This account was existed'));
//         // }
//     } catch(err){
//         let code = 500;
//         return res.status(code).send( helper.responseFailure(false, code, err.message) );
//     }
// }
