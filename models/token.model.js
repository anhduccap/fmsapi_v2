'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const constant = require('../helpers/constants');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const tokenSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    hashValidate: {
        type: String,
        required: true,
    },
    account: {
        type: Number,
        ref: 'Account',
        required: true,
        index: true,
    },
    expiredAt: {
		type: Number,
		require: true,
	},
    status: {
        type: String,
        required: true,
        enum: _.values(constant.TOKEN_STATUS),
    }
}, {
    collection: 'Access_token',
    versionKey: false,
	timestamps: true,
});

tokenSchema.plugin(autoIncrement.plugin, {
    model: `${tokenSchema.options.collection}-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

module.exports = mongoose.model(tokenSchema.options.collection, tokenSchema);
