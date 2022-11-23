const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList} = require('graphql');

const leagueType = new GraphQLObjectType({
    name: 'League',
    fields: () => ({
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        season: {type: GraphQLInt},
        logo: {type: GraphQLString},
    }),
});

module.exports = leagueType;
