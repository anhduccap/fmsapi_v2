const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList} = require('graphql');

const detailInfoType = new GraphQLObjectType({
    name: 'DetailInfo',
    fields: () => ({
        id: {type: GraphQLInt},
        globalID: {type: GraphQLInt},
        height: {type: GraphQLInt},
        weight: {type: GraphQLInt},
        position: {type: GraphQLString},
        detailPosition: {type: new GraphQLList(GraphQLString)},
        kitNumber: {type: GraphQLInt},
    }),
});

module.exports = detailInfoType;
