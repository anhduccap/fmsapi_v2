'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
    },
    title: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },

    date_created: {
        type: Number,
        default: Date.now(),
    },
    date_edited: {
        type: Number,
        default: null,
    }
}, {collecttion: 'Announcement'});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
