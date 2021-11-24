'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    stat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Statistic',
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
    content: {
        type: String,
        require: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    date_created: {
        type: Number,
        default: Date.now(),
    },
    date_edited: {
        type: Number,
        default: null,
    },
}, {collection: 'Comment'});

module.exports = mongoose.model('Comment', CommentSchema);
