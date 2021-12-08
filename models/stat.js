'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatSchema = new Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
    season: {
        type: String,
        require: true,
    },
    rating: {
        type: Number,
        default: null
    },
    injured: {
        type: Boolean,
        default: false,
    },
}, {collection: 'Statistic'});

module.exports = mongoose.model('Statistic', StatSchema);
