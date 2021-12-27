const { validationResult } = require('express-validator');
const axios = require('axios');

const helper = require('../helpers/index');
const CommentModel = require('../models/comment');
const StatModel = require('../models/stat');
const MemberModel = require('../models/member');

let sortFunction = async () => {
    
}

exports.getAllStatistic = async (req, res) => {
    if(req.role === 1 || req.role === 2) {
        try{
            let statList = await StatModel.find({}).populate('player').exec();
            if(!statList) {
                let code = 400;
                return res.status(code).send(helper.responseFailure(false, code, 'Not found'));
            }
    
            let code = 200;
            return res.status(code).send(helper.responseSuccess(true, code, 'Get successful', statList));
        }
        catch(err){
            let code = 500;
            return res.status(code).send( helper.responseFailure(false, code, err.message) );
        }
    };

    let code = 400;
    return res.status(code).send(helper.responseFailure(false, code, 'Access denied'))
}

exports.updateRating = async (req, res) => {
    if(req.role !== 1 && req.role !== 2){
        return res.status(500).send(helper.responseSuccess(false, 500, 'Access denied', null));
    }
    try{
        StatModel.findOneAndUpdate(
            {
                _id: req.query.stat_id,
            }, 
            {rating: req.body.rating}
        ).then( response => res.status(200).send(helper.responseSuccess(true, 200, 'Successful updated')))
        .catch(err => res.status(500).send(err.message));
    }
    catch(err){
        return res.status(400).send(helper.responseFailure(false, 400, err.message, err.response));
    }
}

function swap(arr, a, b) {
    let temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
}

const Compare = {
    LESS_THAN: -1,
    BIGGER_THAN: 1
};

function defaultCompare(a, b) {
    if (a === b) {
        return 0;
    }
    return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

function bubbleSort(arr, compare = defaultCompare) {
    const { length } = arr;
    for (let i = 0; i < length; i++) {
        for (let j = 0; j < length - 1 - i; j++) {
            if (compare(arr[j].rating, arr[j + 1].rating) === Compare.LESS_THAN) {
                swap(arr, j, j + 1);
            }
        }
    }
    return arr;
}

exports.suggestedLineup = async (req, res) => {
    try{
        let statList = await StatModel.find({}).populate('player').exec();

        // console.log(statList);

        statList = statList.map( (stat) => {
            let newData = {
                stat_id: stat._id,
                player_id: stat.player._id,
                player_2nd_id: stat.player.id,
                avatar: stat.player.photo,
                position: stat.player.position,
                detail_position: stat.player.detail_position,
                kit_number: stat.player.kit_number,
                player_name: stat.player.name,
                injured: stat.injured,
                rating: stat.rating,
                season: stat.season,
            }
            return newData;
        });

        statList = bubbleSort(statList);

        let GK = statList.filter( stat => stat.detail_position === 'GK');
        let CB = statList.filter( stat => stat.detail_position === 'CB');
        let LB = statList.filter( stat => stat.detail_position === 'LB');
        let RB = statList.filter( stat => stat.detail_position === 'RB');
        let CM = statList.filter( stat => stat.detail_position === 'CM');
        let LM = statList.filter( stat => stat.detail_position === 'LM');
        let RM = statList.filter( stat => stat.detail_position === 'RM');
        let CAM = statList.filter( stat => stat.detail_position === 'CAM');
        let ST = statList.filter( stat => stat.detail_position === 'ST');

        let result = {
            GK: GK,
            CB: CB,
            LB: LB,
            RB: RB,
            CM: CM,
            LM: LM,
            RM: RM,
            CAM: CAM,
            ST: ST,    
        };

        return res.status(200).send(helper.responseSuccess(true, 200, 'Get successful', result));
    }
    catch (err) {
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, err.message));
    }
}

exports.comment = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        let code = 400;
        return res
            .status(code)
            .send( helper.responseFailure(false, code, 'Invalid input', errors.array()) );
    }

    // Check case: use fake jwt of coach && only coach can comment
    if(req.member_id !== req.params.coach_id || req.role === 3){
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, 'Access denied'));
    }

    console.log(req.body);

    let comment = escape(req.body.content);

    try{
        let stat = await StatModel.findOne({player: req.params.player_id, season: '2021'});
        let coach = await MemberModel.findById(req.params.coach_id);

        const NewComment = new CommentModel({
            stat: stat._id,
            coach: req.params.coach_id,
            content: comment,
        });

        NewComment.save((err) => {
            if(err){
                let code = 400;
                return res.status(code).send(helper.responseFailure(false, code, 'Cannot comment', err.message));
            }
            
            let code = 200;
            return res.status(code).send(helper.responseSuccess(true, code, 'Comment created', {comment: NewComment, coach: coach.name}));
        });
    }
    catch(err) {
        console.log(err.message);
    }
}

exports.editComment = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        let code = 400;
        return res
            .status(code)
            .send( helper.responseFailure(false, code, 'Invalid input', errors.array()) );
    }
    if(req.member_id !== req.params.coach_id || req.role !== 2){
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, 'Access denied'));
    }

    try{
        let newComment = escape(req.body.content);
        let comment = await CommentModel.findOne({_id: req.params.comment_id, is_deleted: false});

        if(!comment) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, 'Comment does not exist'));
        }

        if(comment.content===newComment){
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, 'No changes'));
        }

        if(comment.is_deleted === true){
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, 'Comment was deleted'));
        }

        let editComment = await CommentModel.findOneAndUpdate(
            {_id: req.params.comment_id},
            {
                content: newComment,
                date_edited: Date.now(),
            }
        );
        if(!editComment) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(true, code, 'Cannot edit comment'));
        }

        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, 'Edit successful', {
            old: comment.content,
            new: newComment,
        }));
    }
    catch(err){
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
}

exports.deleteComment = async (req, res) => {
    if(req.member_id !== req.params.coach_id || req.role !== 2){
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, 'Access denied'));
    }

    try {
        let comment = await CommentModel.findOne({_id: req.params.comment_id, is_deleted: false});

        if(!comment) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, 'Comment does not exist'));
        }

        if(comment.is_deleted === true){
            let code = 400;
            return res.status(code).send(helper.responseFailure(true, code, 'Comment was deleted'));
        }

        let editComment = await CommentModel.findOneAndUpdate(
            {_id: req.params.comment_id},
            {
                is_deleted: true,
                date_edited: Date.now(),
            }
        );
        if(!editComment) {
            let code = 400;
            return res.status(code).send(helper.responseFailure(true, code, 'Cannot delete comment'));
        }

        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, 'Delete successful'));
    }
    catch(err) {
        let code = 500;
        return res.status(code).send( helper.responseFailure(false, code, err.message) );
    }
}
