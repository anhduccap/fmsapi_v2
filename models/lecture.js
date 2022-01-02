'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LectureSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
    title: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
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
}, {collection: 'Lecture'});

module.exports = mongoose.model('Lecture', LectureSchema);
