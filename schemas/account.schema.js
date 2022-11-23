const {GraphQLObjectType, GraphQLInt, GraphQLString} = require('graphql');

const detailInfoType = require('./detailInfo.schema');
const detailInfoModel = require('../models/detail.model');
const enumType = require('./enum');

const accountType = new GraphQLObjectType({
    name: 'Account',
    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        gender: {type: GraphQLString},
        phone: {type: GraphQLString},
        email: {type: GraphQLString},
        username: {type: GraphQLString},
        password: {type: GraphQLString},
        photo: {type: GraphQLString},
        age: {type: GraphQLInt},
        dob: {type: GraphQLString},
        nationality: {type: GraphQLString},
        status: {type: enumType.accountStatus},
        type: {type: enumType.accountType},
        detailInfo: {
            type: detailInfoType,
            resolve: async (parent, args) => {
                return await detailInfoModel.findOne({id: parent.detailInfo});
            }
        },
    })
});

module.exports = accountType;
