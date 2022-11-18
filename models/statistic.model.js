'use strict';

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const statSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    player: {
        type: Number,
        ref: 'Account',
        required: true,
    },
    league: {
        type: Number,
        ref: 'League',
        required: true,
    },
    appearences: {
        type: Number,
        required: true,
        default: null,
    },
    lineups: {
        type: Number,
        required: true,
        default: null,
    },
    minutes: {
        type: Number,
        required: true,
        default: null,
    },
    rating: {
        type: Number,
        required: true,
        default: null
    },
    substitutes: {
        type: Object,
        required: true,
        default: null,
    },
    shots: {
        type: Object,
        required: true,
        default: null,
    },
    goals: {
        type: Object,
        required: true,
        default: null,
    },
    passes: {
        type: Object,
        required: true,
        default: null,
    },
    tackles: {
        type: Object,
        required: true,
        default: null,
    },
    duels: {
        type: Object,
        required: true,
        default: null,
    },
    dribbles: {
        type: Object,
        required: true,
        default: null,
    },
    fouls: {
        type: Object,
        required: true,
        default: null,
    },
    cards: {
        type: Object,
        required: true,
        default: null,
    },
    penalty: {
        type: Object,
        required: true,
        default: null,
    },
    injured: {
        type: Boolean,
        default: false,
    },
}, {
    collection: 'Statistic',
    versionKey: false,
	timestamps: true,
});

statSchema.plugin(autoIncrement.plugin, {
    model: `${statSchema.options.collection}-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('Statistic', statSchema);
