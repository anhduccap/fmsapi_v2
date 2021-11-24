'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LectureSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    }
}, {collection: 'Lecture'});

module.exporst = mongoose.model('Lecture', LectureSchema);
