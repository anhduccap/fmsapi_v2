'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Int32 = require("mongoose-int32").loadType(mongoose);

const MemberSchema = new Schema({
    id: {
        type: String,
        require: true,
    },
    position: {
        type: String,
        require: true,
    },
    detail_position: {
        type: String,
        default: '',
    },
    kit_number: {
        type: Int32,
        default: 0,
    },
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    role: {
        type: Number,
        require: true, // 1-admin 2-coach 3-player
    },
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    photo: String,
    is_active: {
        type: Boolean,
        default: true,
    },
    date_created: {
        type: Number,
        default: Date.now(),
    },
    date_edited: {
        type: Number,
        default: null,
    },
}, {collection: 'Member'});

module.exports = mongoose.model('Member', MemberSchema);
