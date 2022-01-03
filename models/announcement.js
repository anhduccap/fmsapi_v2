'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
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
    }
}, {collecttion: 'Announcement'});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
