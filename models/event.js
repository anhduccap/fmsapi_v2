'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Int32 = require('mongoose-int32').loadType('mongoose');

const EventSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    date_start: {
        type: Object,
        require: true,
    },
    date_end: {
        type: Object,
        require: true,
    },
    status: {
        type: Int32,
        default: 1, // 1-scheduled 2-In process 3-Completed 4-Canceled
    },
    type: {
        type: String, // Practice Match ...
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
}, {collection: 'Event'});

module.exports = mongoose.model('Event', EventSchema);
