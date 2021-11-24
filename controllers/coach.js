const { validationResult } = require('express-validator');

const helper = require('../helpers/index');
const CommentModel = require('../models/comment');

exports.comment = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        let code = 400;
        return res
            .status(code)
            .send( helper.responseFailure(false, code, 'Invalid input', errors.array()) );
    }

    // Check case: use fake jwt of coach && only coach can comment
    if(req.member_id !== req.params.coach_id || req.role !== 2){
        let code = 400;
        return res.status(code).send(helper.responseFailure(false, code, 'Access denied'));
    }

    let comment = escape(req.body.content);

    const NewComment = new CommentModel({
        stat: req.params.stat_id,
        coach: req.params.coach_id,
        content: comment,
    });

    NewComment.save((err) => {
        if(err){
            let code = 400;
            return res.status(code).send(helper.responseFailure(false, code, 'Cannot comment', err.message));
        }
        
        let code = 200;
        return res.status(code).send(helper.responseSuccess(true, code, 'Comment created'));
    });
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
