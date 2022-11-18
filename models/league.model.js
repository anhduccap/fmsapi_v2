'use strict';

const mongoose = require('mongoose');

const leagueSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    season: {
        type: Number,
        required: true,
    },
    logo: {
        type: String,
        required: true
    }
}, {
    collection: 'League',
    versionKey: false,
	timestamps: true,
});

module.exports = mongoose.model('League', leagueSchema);
