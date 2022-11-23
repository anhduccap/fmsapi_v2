const {GraphQLObjectType, GraphQLInt, GraphQLBoolean, GraphQLFloat} = require('graphql');

const accountType = require('./account.schema');
const leagueType = require('./league.schema');
const accountModel = require('../models/account.model');
const leagueModel = require('../models/league.model');

const substitutesType = new GraphQLObjectType({
    name: 'substitutesType',
    fields: () => ({
        in: {type: GraphQLInt},
        out: {type: GraphQLInt},
        bench: {type: GraphQLInt},
    }),
});

const shotsType = new GraphQLObjectType({
    name: 'shotsType',
    fields: () => ({
        total: {type: GraphQLInt},
        on: {type: GraphQLInt},
    }),
});

const goalsType = new GraphQLObjectType({
    name: 'goalsType',
    fields: () => ({
        total: {type: GraphQLInt},
        conceded: {type: GraphQLInt},
        assists: {type: GraphQLInt},
        saves: {type: GraphQLInt},
    }),
});

const passesType = new GraphQLObjectType({
    name: 'passesType',
    fields: () => ({
        total: {type: GraphQLInt},
        key: {type: GraphQLInt},
        accuracy: {type: GraphQLInt},
    }),
});

const tacklesType = new GraphQLObjectType({
    name: 'tacklesType',
    fields: () => ({
        total: {type: GraphQLInt},
        blocks: {type: GraphQLInt},
        interceptions: {type: GraphQLInt},
    }),
});

const duelsType = new GraphQLObjectType({
    name: 'duelsType',
    fields: () => ({
        total: {type: GraphQLInt},
        won: {type: GraphQLInt},
    }),
});

const dribblesType = new GraphQLObjectType({
    name: 'dribblesType',
    fields: () => ({
        attempts: {type: GraphQLInt},
        success: {type: GraphQLInt},
        past: {type: GraphQLInt},
    }),
});

const foulsType = new GraphQLObjectType({
    name: 'foulsType',
    fields: () => ({
        drawn: {type: GraphQLInt},
        committed: {type: GraphQLInt},
    }),
});

const cardsType = new GraphQLObjectType({
    name: 'cardsType',
    fields: () => ({
        yellow: {type: GraphQLInt},
        yellowred: {type: GraphQLInt},
        red: {type: GraphQLInt},
    }),
});

const penaltyType = new GraphQLObjectType({
    name: 'penaltyType',
    fields: () => ({
        won: {type: GraphQLInt},
        commited: {type: GraphQLInt},
        scored: {type: GraphQLInt},
        missed: {type: GraphQLInt},
        saved: {type: GraphQLInt},
    }),
});

const statisticType = new GraphQLObjectType({
    name: 'Statistic',
    fields: () => ({
        id: {type: GraphQLInt},
        player: {
            type: accountType,
            resolve: async (parent, args) => {
                return await accountModel.findOne({id: parent.player});
            },
        },
        league: {
            type: leagueType,
            resolve: async (parent, args) => {
                return await leagueModel.findOne({id: parent.league});
            }
        },
        appearences: {type: GraphQLInt},
        lineups: {type: GraphQLInt},
        minutes: {type: GraphQLInt},
        rating: {type: GraphQLFloat},
        substitutes: {type: substitutesType},
        shots: {type: shotsType},
        goals: {type: goalsType},
        passes: {type: passesType},
        tackles: {type: tacklesType},
        duels: {type: duelsType},
        dribbles: {type: dribblesType},
        fouls: {type: foulsType},
        cards: {type: cardsType},
        penalty: {type: penaltyType},
        injured: {type: GraphQLBoolean},
    }),
});

module.exports = statisticType;
