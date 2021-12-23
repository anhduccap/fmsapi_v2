const request = require('request');

const helper = require('../helpers/index');
const MemberModel = require('../models/member');
const StatModel = require('../models/stat');
const CommentModel = require('../models/comment');

exports.getAllPlayer = async (req, res) => {
    if(req.role === 1 || req.role === 2) {
        try{
            let memberList = await MemberModel.find({role: 3});
            if(!memberList) {
                let code = 400;
                return res.status(code).send(helper.responseFailure(false, code, 'Not found'));
            }
    
            let code = 200;
            return res.status(code).send(helper.responseSuccess(true, code, 'Get successful', memberList));
        }
        catch(err){
            let code = 500;
            return res.status(code).send( helper.responseFailure(false, code, err.message) );
        }
    };

    let code = 400;
    return res.status(code).send(helper.responseFailure(false, code, 'Access denied'))
}

exports.createStatistic = async (req, res) => {
    if(req.role !== 1) {
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, 'Access denied'))
    };

    try{
        let member = await MemberModel.findById(req.params.player_id);
        if(!member) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, 'Member not found'));
        }
        
        let stat = await StatModel.findOne({player: member._id});
        if(stat) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, 'Statistic was existed'));
        }

        const Stat = new StatModel({
            player: member._id,
            season: req.query.season,
        });

        Stat.save((err) => {
            if(err) {
                let code = 500;
                return res.status(code).send(helper.responseFailure(false, code, err.message));
            }
            let code = 200;
            return res.status(code).send(helper.responseSuccess(true, code, 'Success creation'));
        });
    }
    catch(err){
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
}

exports.getStatistic = async (req, res) => {
    //Only player with id or coach, admin can view statistic
    if(req.member_id === req.params.player_id || req.role === 1 || req.role === 2) {
        try{
            let stat = await StatModel.findOne({player: req.params.player_id}).populate('player').exec();
            let query = {id: stat.player.id, season: stat.season};
            var options = {
                method: 'GET',
                url: 'https://v3.football.api-sports.io/players',
                qs: query,
                headers: {
                    'x-rapidapi-host': 'v3.football.api-sports.io',
                    'x-rapidapi-key': '39ca433ef98ac8cb40a89b37f1111714'
                }
            };
              
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
    
                let data = JSON.parse(body);
                let code = 200;
                
                return res.status(code).send(helper.responseSuccess(true, code, 'Successful', data));
            });
        }
        catch(err){
            let code = 500;
            return res.status(code).send( helper.responseFailure(false, code, err.message) );
        }
    }
    else {
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, 'Access denied'));
    }
}

exports.getPlayer = async (req, res) => {
    try {
        let member = await MemberModel.findById(req.member_id);
        let data = {
            id: member.id,
            name: member.name,
            avatar: member.photo,
            kit_number: member.kit_number,
            position: member.position,
            detail_position: member.detail_position,

        };
        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, 'Sucess', data));
    }
    catch(err){
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
}

exports.getComment = async (req, res) => {
    if((req.member_id === req.params.player_id && req.role === 3) || req.role === 1 || req.role === 2){
        try{
            let stat = await StatModel.findOne({player: req.params.player_id, season: req.query.season});

            if(!stat){
                let code = 400;
                return res.status(code).send(helper.responseFailure(false, code,'This statistic does not exist'));
            }

            let commentList = await CommentModel.find({stat: stat._id, is_deleted: false}).populate('coach').exec();
            console.log(commentList);
            if(!commentList || commentList.length === 0){
                let code = 400;
                return res.status(code).send(helper.responseFailure(false, code,'Have no comments'));
            }

            commentList = await commentList.map(comment => {
                let date = comment.date_edited;
                if(date === null){
                    date = comment.date_created;
                }
                return {
                    comment_id: comment._id,
                    coach_id: comment.coach._id,
                    coach_name: comment.coach.name,
                    content: comment.content,
                    date: date,
                };
            });

            let code = 200;
            return res.status(code).send(helper.responseSuccess(true, code, 'Get successful', commentList));
        }
        catch(err){
            let code = 500;
            return res.status(code).send( helper.responseFailure(false, code, err.message) );
        }
    }
    else {
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, 'Access denied'));
    }
}
