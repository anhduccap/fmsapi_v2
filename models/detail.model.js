'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const constants = require('../helpers/constants');

const playerDetailSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    globalID: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    height: {
        type: String,
        required: true,
    },
    weight: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    detailPosition: {
        type: [String],
        enum: _.values(constants.DETAIL_POSITION),
        required: true,
    },
    kitNumber: {
        type: Number,
        required: true,
        default: null,
    },
}, {
    collection: 'Player_detail',
    versionKey: false,
	timestamps: true,
});

playerDetailSchema.plugin(autoIncrement.plugin, {
    model: `${playerDetailSchema.options.collection}-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('Player_detail', playerDetailSchema);
