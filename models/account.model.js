'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const constants = require('../helpers/constants');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const accountSchema = mongoose.Schema({
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
    firstName: {
        type: String,
        default: '',
    },
    lastName: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        enum: _.values(constants.GENDER),
        default: 'MALE',
    },
    phone: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
    },
    username: {
        type: String,
        required: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: '',
    },
    age: {
        type: Number,
        required: true,
    },
    dob: {
        type: String,
        default: '',
    },
    nationality: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: _.values(constants.STATUS),
        default: 'ACTIVE'
    },
    type: {
        type: String,
        enum: _.values(constants.ACCOUNT_TYPE),
        required: true,
    },
    detailInfo: {
        type: Number,
        ref: 'Player_detail',
        default: null,
    }
}, {
    collection: 'Account',
    versionKey: false,
	timestamps: true,
});

accountSchema.plugin(autoIncrement.plugin, {
    model: `${accountSchema.options.collection}-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model('Account', accountSchema);
