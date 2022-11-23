const {GraphQLObjectType, GraphQLList} = require('graphql');

const accountType = require('./account.schema');
const statisticType = require('./statistic.schema');
const accountModel = require('../models/account.model');
const statisticModel = require('../models/statistic.model');

const rootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        players: {
            type: new GraphQLList(accountType),
            resolve: async (parent, args) => {
                return await accountModel.find({type: 'PLAYER'});
            }
        },
        statistics: {
            type: new GraphQLList(statisticType),
            resolve: async (parent, args) => {
                return await statisticModel.find({});
            },
        }
    }
});

module.exports = rootQuery;
